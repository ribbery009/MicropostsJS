// CommonJS Module
//const Person=require('./mymodule1');
import { http } from './http';
import { ui } from './ui';

// Get posts on DOM load
document.addEventListener('DOMContentLoaded', ui.toGenerate);

// Listen for add post
document.querySelector('.post-submit').addEventListener('click', submitPost);

// Listen for delete
document.querySelector('#posts').addEventListener('click', deletePost);

// Listen for edit state
document.querySelector('#posts').addEventListener('click', enableEdit);

// Listen for cancel
document.querySelector('.card-form').addEventListener('click', cancelEdit);

// Submit Post
function submitPost() {
  const title = document.querySelector('#title').value;
  const body = document.querySelector('#body').value;
  const id = document.querySelector('#id').value;

  const info = {
    title,
    body
  }

  // Validate input
  if(title === '' || body === '') {
    ui.showAlert('Please fill in all fields', 'alert alert-danger');
  } else {
    // Check for ID
    if(id === '') {
      // Create Post
      http.post('http://localhost:3000/posts', info)
      .then(data => {
        ui.showAlert('Post added', 'alert alert-success');
        ui.clearFields();
        //getPosts();
        ui.toGenerate();
      })
      .catch(err => console.log(err));
    } else {
      // Update Post
      http.put(`http://localhost:3000/posts/${id}`, info)
      .then(data => {
        ui.showAlert('Post updated', 'alert alert-success');
        ui.changeFormState('add');
        //getPosts();
        ui.toGenerate();
      })
      .catch(err => console.log(err));
    }

  }
}

// Delete Post
function deletePost(e) {
  if(e.target.parentElement.classList.contains('delete')) {
    const id = e.target.parentElement.dataset.id;
    if(confirm('Are you sure?')) {
      http.delete(`http://localhost:3000/posts/${id}`)
        .then(data => {
          ui.showAlert('Post removed', 'alert alert-success');
          ui.toGenerate();
        })
        .catch(err => console.log(err));
    }
  }
  e.preventDefault();
}

// Enable Edit State
function enableEdit(e) {
  if(e.target.parentElement.classList.contains('edit')) {
    const id = e.target.parentElement.dataset.id;
    const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;
    const body = e.target.parentElement.previousElementSibling.textContent;
    const data = {
      id,
      title,
      body
    }

    // Fill form with current post
    ui.fillForm(data);
  }
  ui.toGenerate();
  e.preventDefault();
}

// Cancel Edit State
function cancelEdit(e) {
  if(e.target.classList.contains('post-cancel')) {
    ui.changeFormState('add');
  }

  e.preventDefault();
}
