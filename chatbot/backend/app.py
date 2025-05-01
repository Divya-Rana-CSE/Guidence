from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from pathlib import Path
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import CharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
from langchain_core.documents import Document

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Path configuration
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / 'data'
MEMORY_FILE = BASE_DIR / 'backend' / 'memory.json'
MBTI_FILE = BASE_DIR / 'backend' / 'mbti_profiles.json'
FRONTEND_DIR = BASE_DIR / 'frontend'

# Ensure data directory exists
DATA_DIR.mkdir(exist_ok=True, parents=True)

class ChatBot:
    def __init__(self, mbti_type="INFP"):
        self.memory_file = MEMORY_FILE
        self.memory = {"history": []}
        self.mbti_type = mbti_type.upper()
        
        # Initialize empty MBTI profiles if file doesn't exist
        if not MBTI_FILE.exists():
            with open(MBTI_FILE, 'w') as f:
                json.dump({}, f)
        
        # Load MBTI profiles
        try:
            with open(MBTI_FILE, 'r', encoding='utf-8') as f:
                self.mbti_profiles = json.load(f)
        except Exception as e:
            print(f"Error loading MBTI profiles: {str(e)}")
            self.mbti_profiles = {}

        self.user_profile = self.mbti_profiles.get(self.mbti_type, {
            "style": "supportive",
            "topics": ["well-being"],
            "tone": "calm"
        })

        # Create default about_me.txt if it doesn't exist
        about_me = DATA_DIR / "about_me.txt"
        if not about_me.exists():
            with open(about_me, 'w', encoding='utf-8') as f:
                f.write("My name is MiniBot. I care about your well-being.")
        
        self.setup_rag()

    def setup_rag(self):
        print("\n=== Initializing RAG System ===")
        print(f"Data directory: {DATA_DIR}")
        
        # Initialize with a default document if no files exist
        if not any(DATA_DIR.glob("*.txt")):
            print("No text files found, creating default document")
            default_file = DATA_DIR / "default.txt"
            with open(default_file, 'w', encoding='utf-8') as f:
                f.write("Mental health is important. Practice self-care regularly.")
        
        texts = []
        text_splitter = CharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        
        # Load and process documents
        for file in DATA_DIR.glob("*.txt"):
            try:
                print(f"\nProcessing file: {file.name}")
                loader = TextLoader(str(file), encoding='utf-8')
                documents = loader.load()
                print(f"Loaded {len(documents)} document(s)")
                
                split_docs = text_splitter.split_documents(documents)
                print(f"Split into {len(split_docs)} chunks")
                texts.extend(split_docs)
                
                # Print sample content
                if split_docs:
                    sample = split_docs[0].page_content[:100].replace('\n', ' ')
                    print(f"Sample content: {sample}...")
            except Exception as e:
                print(f"Error processing {file.name}: {str(e)}")
                continue
        
        # Fallback if no texts were loaded
        if not texts:
            print("Warning: No documents loaded, using fallback text")
            texts = [Document(page_content="Mental health matters. Talk about your feelings.")]
        
        # Initialize embeddings
        try:
            print("\nInitializing embeddings...")
            embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
            
            print("Creating vectorstore...")
            self.vectorstore = FAISS.from_documents(
                documents=texts,
                embedding=embeddings
            )
            print("Vectorstore created successfully")
        except Exception as e:
            print(f"Error creating vectorstore: {str(e)}")
            raise RuntimeError("Failed to initialize vectorstore") from e
        
        # Initialize LLM
        try:
            print("Initializing LLM...")
            self.llm = OllamaLLM(model="llama3")
            print("LLM initialized successfully")
        except Exception as e:
            print(f"Error initializing LLM: {str(e)}")
            raise RuntimeError("Failed to initialize LLM") from e

    def get_response(self, user_input):
        try:
            self.memory["history"].append({"user": user_input})
            
            # Get relevant context
            docs = self.vectorstore.similarity_search(user_input, k=1)
            context = docs[0].page_content if docs else "No specific context found."
            
            prompt = f"""You are a mental health assistant (MBTI: {self.mbti_type}).
Respond with a {self.user_profile['tone']} tone focusing on: {', '.join(self.user_profile['topics'])}.

Context:
{context}

User: {user_input}
Assistant:"""
            
            response = self.llm.invoke(prompt)
            self.memory["history"].append({"bot": response})
            
            # Save memory
            with open(self.memory_file, 'w', encoding='utf-8') as f:
                json.dump(self.memory, f, indent=2)
            
            return response
        except Exception as e:
            print(f"Error generating response: {str(e)}")
            return "I encountered an error processing your request."

# Initialize chatbot instance
try:
    print("Initializing chatbot...")
    bot_instance = ChatBot()
    print("Chatbot initialized successfully!")
except Exception as e:
    print(f"Failed to initialize chatbot: {str(e)}")
    raise

# API Routes
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        message = data.get("message", "")
        mbti = data.get("mbti", "INFP")

        if mbti:
            bot_instance.mbti_type = mbti.upper()
            bot_instance.user_profile = bot_instance.mbti_profiles.get(
                mbti.upper(), 
                {
                    "style": "supportive",
                    "topics": ["well-being"],
                    "tone": "calm"
                }
            )

        reply = bot_instance.get_response(message)
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Frontend Routes
@app.route('/')
def serve_index():
    return send_from_directory(str(FRONTEND_DIR), 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(str(FRONTEND_DIR), path)

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(debug=True, port=5000)