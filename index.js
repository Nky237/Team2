const selectElement = (selector) => {
  const element = document.querySelector(selector);
  if (element) return element;
  throw new Error(`Cannot find the element ${selector}`);
};


// Select Items
const form = selectElement("form");
const input = selectElement("input");
const result = document.querySelector(".list"); 
let navLinks = document.querySelector('.mobile-nav-links');
let burgerBtn = document.querySelector('.burger');
let mainContent = document.querySelector('main');
let errorMsg = document.querySelector('.msg');



// DROPDOWN MENU
burgerBtn.addEventListener('click',function(){
navLinks.classList.toggle('active')
mainContent.classList.toggle('main-drop')
})



// SHORTENING

form.addEventListener("submit", (e) => {
e.preventDefault();
if(input.value === ''){

    // Error Message
  errorMsg.innerHTML = 'Please add a link';
  input.style.border = '1px solid rgb(250, 70, 70)';
  
    // Revert to normal
  setTimeout(()=>{
    errorMsg.innerHTML = '';
    input.style.border = 'none';
  }, 2000);

}else{
  const url = input.value;

  shortenUrl(url);
}
});


// Fetch API
async function shortenUrl(url) {
try {
  const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
  const data = await res.json();
  const short_link = data.result.short_link;

  // new shortened link
  let link = new shortLink(short_link)
  // Add to List
  UI.addListsToList(link)
  // Add to store
  store.addList(link)

  input.value = "";
  
}catch (err) {
  console.log(err);
}
}


// CLASSES

// Link Class: Represent a shortened link
class shortLink{
constructor(link){
  this.link = link;
}
}


// UI class: Handle UI Tasks
class UI{
static displayList(){
  const storedLists = store.getList();

  const lists = storedLists;
  lists.forEach((li)=> UI.addListsToList(li))
}

static addListsToList(link){
  const newUrl = document.createElement("p");
  newUrl.classList.add("list-group");
  newUrl.innerHTML = ` 
  <p>${link.link}</p>
  <button class="btn-list">Copy</button>
  <button class="btn-del">Delete</button>
  `;
  result.prepend(newUrl);
}
}


// Store Class: LOCAL STORAGE
class store{
// Get List from storage
static getList(){
  let lists;
  if(localStorage.getItem('lists') === null){
    lists = []
  }else{
    lists = JSON.parse(localStorage.getItem('lists'))
  }

  return lists
}

// Add List to store
static addList(list){
  const lists = store.getList();

  lists.push(list)
  localStorage.setItem('lists', JSON.stringify(lists))
}

// Remove List from store
static removeList(btn){
  const link = btn.previousElementSibling.previousElementSibling.textContent;
  const lists = store.getList();

  // Loops through the array of objects
  lists.forEach((shortLink, i) => {
    if(shortLink.link === link){
      lists.splice(i, 1);
    }
  });

  // Set the modified list back to storage
  localStorage.setItem('lists', JSON.stringify(lists))
}
}  


// EVENTS

// EVENT: Display Lists
result.addEventListener('DOMContentLoaded', UI.displayList());


// EVENT: Copies a Shortened Link
result.addEventListener("click", (e) => {
if(e.target.classList.contains('btn-list')){
  navigator.clipboard.writeText(e.target.previousElementSibling.textContent);
  let btn = e.target;
  btn.style.backgroundColor = 'rgb(61, 3, 95)';
  btn.innerHTML = 'Copied!'

  // Revert to normal
  setTimeout(() =>{
      btn.style.backgroundColor = '';
      btn.innerHTML = 'Copy'
  }, 1000);
}
});


// EVENT: Removes an Item
result.addEventListener("click", (e)=>{
if(e.target.classList.contains('btn-del')){

  // Remove Item from UI
  e.target.parentElement.remove();

  // Remove Item from Store
  store.removeList(e.target)
}
});