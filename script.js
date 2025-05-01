//JS

// MBTI-based questions
const mbtiQuestions = {
  "ISTJ": [
    "How can your sense of duty help you meet your goals this week?",
    "What routines keep you productive and how can you improve them?"
  ],
  "ISFJ": [
    "How can your helpful nature support someone close to you this week?",
    "What is one quiet strength you want to express more openly?"
  ],
  "INFJ": [
    "What personal value can guide your goals this week?",
    "How can your empathy make a difference today?"
  ],
  "INTJ": [
    "What strategy can help you accomplish your weekly goals?",
    "How can your long-term vision guide today’s priorities?"
  ],
  "ISTP": [
    "How can you use your problem-solving skills to overcome a challenge?",
    "What hands-on task are you excited to finish this week?"
  ],
  "ISFP": [
    "How will you make space for creativity and peace this week?",
    "What moment of beauty inspired you recently?"
  ],
  "INFP": [
    "Which of your values will help you make an important decision this week?",
    "How can your imagination lead to action today?"
  ],
  "INTP": [
    "What complex idea has been on your mind lately?",
    "How can you turn one of your thoughts into something real this week?"
  ],
  "ESTP": [
    "What action can you take today to solve a problem quickly?",
    "How can you bring your energy to motivate others this week?"
  ],
  "ESFP": [
    "What moment this week brought you the most joy?",
    "How can you uplift others using your enthusiasm today?"
  ],
  "ENFP": [
    "What new idea are you excited to explore this week?",
    "How can your creativity help solve a challenge today?"
  ],
  "ENTP": [
    "What’s a new challenge you’re eager to tackle?",
    "How can your quick thinking help someone else today?"
  ],
  "ESTJ": [
    "What’s one practical step you can take toward your biggest goal this week?",
    "How can you use your leadership skills for the benefit of others?"
  ],
  "ESFJ": [
    "What act of kindness will you initiate this week?",
    "How can your sense of responsibility bring people together today?"
  ],
  "ENFJ": [
    "How can your encouragement help someone reach their potential?",
    "What group goal are you most excited to contribute to this week?"
  ],
  "ENTJ": [
    "What bold move can you make this week to advance your goals?",
    "How can your leadership inspire others today?"
  ]
};

// Get the MBTI type from the HTML dynamically
function getUserMBTI() {
  const mbtiElement = document.getElementById('mbti-type');
  return mbtiElement ? mbtiElement.textContent.trim().toUpperCase() : "ENFP";
}

// Get a random question from the MBTI list
function getRandomQuestion(type) {
  const questions = mbtiQuestions[type];
  if (!questions || questions.length === 0) {
    return "No questions available for your MBTI type.";
  }
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

// Show the question on the page
function showRandomQuestion() {
  const questionElement = document.getElementById("qotd-text");
  const mbti = getUserMBTI();
  if (questionElement) {
    questionElement.textContent = getRandomQuestion(mbti);
  }
}

// Show comment section
function showCommentSection() {
  const section = document.getElementById('commentSection');
  if (section) section.style.display = 'block';
}

// Submit comment logic with success/failure feedback
function submitComment() {
  const comment = document.getElementById('userComment').value;
  const feedbackElement = document.getElementById('submitFeedback'); // element for feedback (green tick/red cross)

  if (comment.trim()) {
    try {
      // Save multiple comments with timestamp
      let allComments = JSON.parse(localStorage.getItem('userComments')) || [];
      allComments.push({
        text: comment,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('userComments', JSON.stringify(allComments));
      console.log("User's Thought:", comment);

      // Show success feedback
      feedbackElement.textContent = '✔️';
      feedbackElement.style.color = 'green';
      setTimeout(() => {
        feedbackElement.textContent = '';
      }, 2000);

      alert("Thanks for sharing your thoughts!");
      document.getElementById('userComment').value = ""; // clear input
      document.getElementById('commentSection').style.display = 'none'; // hide comment section again
    } catch (error) {
      console.error("Error storing comment:", error);

      // Show failure feedback
      feedbackElement.textContent = '❌';
      feedbackElement.style.color = 'red';
      alert("Failed to save your comment. Please try again.");
    }
  } else {
    // Show failure feedback if input is empty
    feedbackElement.textContent = '❌';
    feedbackElement.style.color = 'red';
    alert("Please enter a comment before submitting.");
  }
}


//tO DISPLAY COMMENTS BOX 
// function displayPreviousComments() {
//   const comments = JSON.parse(localStorage.getItem('userComments')) || [];
//   const list = document.getElementById('previousComments'); // create this div in HTML
//   list.innerHTML = ''; // clear before populating

//   comments.forEach(({ text, timestamp }) => {
//     const item = document.createElement('div');
//     item.className = 'comment-item';
//     item.textContent = `${new Date(timestamp).toLocaleString()}: ${text}`;
//     list.appendChild(item);
//   });
// }


// // Main script logic
// document.addEventListener('DOMContentLoaded', () => {
//   const startChattingButton = document.querySelector('.ai-support .button');
//   const shareThoughtsButton = document.querySelector('.question-of-day .button');
//   const logoutButton = document.querySelector('.logout-button');
//   const successAlert = document.querySelector('.success-alert');

//   // Display the MBTI-based question of the day
//   showRandomQuestion();

//   // AI Support Chat click
//   if (startChattingButton) {
//     startChattingButton.addEventListener('click', () => {
//       alert('Chat functionality will be implemented in a future update!');
//     });
//   }

//   // Share Thoughts click
//   if (shareThoughtsButton) {
//     shareThoughtsButton.addEventListener('click', showCommentSection);
//   }

//   // Logout click
//   if (logoutButton) {
//     logoutButton.addEventListener('click', () => {
//       alert('You have been logged out!');
//     });
//   }

//   // Show and auto-hide success alert
//   if (successAlert) {
//     successAlert.style.display = 'block';
//     setTimeout(() => {
//       successAlert.style.opacity = '0';
//       successAlert.style.transition = 'opacity 1s';
//       setTimeout(() => {
//         successAlert.style.display = 'none';
//       }, 1000);
//     }, 5000);
//   }
// });

// // Make submitComment globally available for inline onclick
// window.submitComment = submitComment;

// function cancelComment() {
//   const commentSection = document.getElementById('commentSection');
//   const userComment = document.getElementById('userComment');
//   userComment.value = '';
//   commentSection.style.display = 'none';
// }

// window.cancelComment = cancelComment;



// Your existing MBTI-based questions and other code...

// Function to display previous comments from localStorage
function displayPreviousComments() {
  const comments = JSON.parse(localStorage.getItem('userComments')) || [];
  const list = document.getElementById('previousComments'); // This is the div where comments will be displayed
  list.innerHTML = ''; // Clear previous comments before populating

  comments.forEach(({ text, timestamp }) => {
    const item = document.createElement('div');
    item.className = 'comment-item';
    item.textContent = `${new Date(timestamp).toLocaleString()}: ${text}`;
    list.appendChild(item);
  });
}

// Main script logic (this should be inside your `DOMContentLoaded` event listener)
document.addEventListener('DOMContentLoaded', () => {
  const startChattingButton = document.querySelector('.ai-support .button');
  const shareThoughtsButton = document.querySelector('.question-of-day .button');
  const logoutButton = document.querySelector('.logout-button');
  const successAlert = document.querySelector('.success-alert');

  // Display the MBTI-based question of the day
  showRandomQuestion();

  // AI Support Chat click
  if (startChattingButton) {
    startChattingButton.addEventListener('click', () => {
      alert('Chat functionality will be implemented in a future update!');
    });
  }

  // Share Thoughts click
  if (shareThoughtsButton) {
    shareThoughtsButton.addEventListener('click', showCommentSection);
  }

  // Logout click
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      alert('You have been logged out!');
    });
  }

  // Show and auto-hide success alert
  if (successAlert) {
    successAlert.style.display = 'block';
    setTimeout(() => {
      successAlert.style.opacity = '0';
      successAlert.style.transition = 'opacity 1s';
      setTimeout(() => {
        successAlert.style.display = 'none';
      }, 1000);
    }, 5000);
  }

  // Display previous comments when the page loads
  displayPreviousComments();
});

// Function to handle comment cancellation
function cancelComment() {
  const commentSection = document.getElementById('commentSection');
  const userComment = document.getElementById('userComment');
  userComment.value = '';
  commentSection.style.display = 'none';
}

window.cancelComment = cancelComment;

// Make submitComment globally available for inline onclick
window.submitComment = submitComment;
