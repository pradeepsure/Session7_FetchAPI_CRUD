let contactsList = [];
function getContacts(){
  //  console.log('getContacts() ...');

  fetch('http://localhost:3000/contacts').then(response =>{
    //  console.log(response);
      if(response.ok){         
              return response.json();          
      }
      else if(response.status == 404){
          return Promise.reject(new Error('Invalid URL'))
      }
      else if(response.status == 401){
          return Promise.reject(new Error('UnAuthorized User...'));
      }
      else{
          return Promise.reject(new Error('Some internal error occured...'));
      }
  }).then(contactsResponse =>{
    //console.log('contacts Response',contactsResponse);
        contactsList = contactsResponse;  
      displayContacts(contactsList);
  }).catch(error =>{
    //  console.log('error',error);
    const errorEle = document.getElementById('error');
    errorEle.innerHTML = `<h2 style='color:red'>${error.message}</h2>`
      
  })
    
}

function displayContacts(contactsList){
    //Display the contacts in UI
  const tableEle =   document.getElementById('contactstable');
  const tableBodyEle = tableEle.getElementsByTagName('tbody')[0];
  let tableBodyHTMLString = '';
  console.log('contactsList', contactsList);
  
  contactsList.forEach(contact => {
      tableBodyHTMLString += `
        <tr>
            <td>${contact.name}</td>
            <td>${contact.contactno}</td>
            <td>${contact.email}</td>
            <td><button class='btn btn-primary' onclick='updateContact(${contact})'>update</button></td>
            <td><i class='fa fa-trash' style='color:red;font-size:1.2em;cursor:pointer' onclick='removeContact(${contact.id})'></i></td>
        </tr>
      
      `
  });

  tableBodyEle.innerHTML = tableBodyHTMLString;
  
}

// addcontact
function addContact(event){
    event.preventDefault();
    //Get the data from the form
    let name = document.getElementById('name').value;
    let contactno = document.getElementById('contactno').value;
    let email = document.getElementById('email').value;

    const contact = {
        name : name,
        contactno : contactno,
        email : email
    };

    console.log(contact.name + '' + contact.contactno + " "+ contact.email);
    

    //Fetch POST
    fetch('http://localhost:3000/contacts',{
        method: 'POST',
        headers:{
            'content-type':'application/json'
        },
        body: JSON.stringify(contact)
    }).then(response =>{
        if(response.ok){
            return response.json();
        }
    }).then(addedContact =>{
        console.log('added Contact',addedContact);
        
    })
}



function removeContact(id){
    //console.log('remove contact',id);
    //send delete request to json-server
    fetch(`http://localhost:3000/contacts/${id}`,{
        method: 'DELETE'
        }).then(response =>{
            if(response.ok){
                return response.json();
            }
        }).then(deleteResponse =>{
            console.log('deleteResponse',deleteResponse);
            //Delete this entry from the array
            const index = contactsList.findIndex(contact => contact.id === id);
            contactsList.splice(index,1);
            displayContacts(contactsList);
        })
}