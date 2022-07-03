const selectElement = (selector) => {
  const element = document.querySelector(selector);
  if (element) return element;
  throw new Error(`Cannot find the element ${selector}`);
};


// Select Items
const form = selectElement("form");
const input = selectElement("input");
const result = selectElement(".list"); 
let navLinks = document.querySelector('.mobile-nav-links')
let burgerBtn = document.querySelector('.burger')
let mainContent = document.querySelector('main')
let errorMsg = document.querySelector('.msg')


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
  const newUrl = document.createElement("p");
  newUrl.classList.add("list-group");
  newUrl.innerHTML = ` 
 <p> ${data.result.short_link}</p>
 <button class="btn-list" >Copy</button>
 `;
  result.prepend(newUrl);

  // Copy-Button Interaction
  const copyBtn = result.querySelector(".btn-list");

  copyBtn.addEventListener("click", (e) => {
    if(e.target.classList.contains('btn-list')){
      navigator.clipboard.writeText(copyBtn.previousElementSibling.textContent);
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
  input.value = "";
} catch (err) {
  console.log(err);
}
}