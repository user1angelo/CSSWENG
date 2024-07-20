//  keeping this commented because it does not work, so i put the JS in the handlebar code lol

// document.addEventListener('DOMContentLoaded', () => {
//     alert('JavaScript loaded!');
//     console.log('forum.js loaded');

//     document.querySelectorAll('.upvote').forEach(button => {
//         button.addEventListener('click', async (event) => {
//             const postId = event.target.getAttribute('data-id');
//             console.log('Upvote button clicked for post:', postId);
//             try {
//                 const response = await fetch(`/forum/post/${postId}/upvote`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });
//                 const result = await response.json();
//                 console.log('Upvote response:', result);
//                 event.target.textContent = `Upvote (${result.upvotes})`;
//                 event.target.nextElementSibling.textContent = `Downvote (${result.downvotes})`;
//             } catch (error) {
//                 console.error('Error upvoting post:', error);
//             }
//         });
//     });

//     document.querySelectorAll('.downvote').forEach(button => {
//         button.addEventListener('click', async (event) => {
//             const postId = event.target.getAttribute('data-id');
//             console.log('Downvote button clicked for post:', postId);
//             try {
//                 const response = await fetch(`/forum/post/${postId}/downvote`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });
//                 const result = await response.json();
//                 console.log('Downvote response:', result);
//                 event.target.textContent = `Downvote (${result.downvotes})`;
//                 event.target.previousElementSibling.textContent = `Upvote (${result.upvotes})`;
//             } catch (error) {
//                 console.error('Error downvoting post:', error);
//             }
//         });
//     });
// });