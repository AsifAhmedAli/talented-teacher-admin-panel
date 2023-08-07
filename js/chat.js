// Function to fetch chat rooms from the backend API
function fetchChatRooms() {
// Make a GET request to fetch chat rooms
$.ajax({
    url: `${baseurl}/all-chat-rooms`,
    type: 'GET',
    dataType: 'json',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') // Include token in the authorization header
    },
    success: function (response) {
        // Handle the success response
        const chatRooms = response.chatRooms;
        const chatRoomsList = $('.chat-rooms-list');
        chatRoomsList.empty();

        if (chatRooms.length > 0) {
            chatRooms.forEach((chatRoom) => {
                // chatRoomsList.append(`<div class="border mb-2 p-2">${chatRoom.room_name}</div>`);
                chatRoomsList.append( `<div class="border mb-2 p-2" data-chatroom-id="${chatRoom.id}">${chatRoom.room_name}</div>`);
            });
            $('#noChatRoomsMessage').hide();
            chatRoomsList.css('overflow-y', 'auto');
            chatRoomsList.css('max-height', '300px'); // Set a maximum height for the scrollbar
        } else {
            // Show message if no chat rooms are created
            $('#noChatRoomsMessage').show();
            chatRoomsList.css('overflow-y', 'hidden');
        }
    },
    error: function (error) {
        // Handle the error response
        console.log(error);
    }
});
}

// Function to fetch voters from the backend API
function fetchVoters() {
  // Make a GET request to fetch voters with pagination
  $.ajax({
    url: `${baseurl}/get-all-teachers`,
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"), 
    },
    success: function (response) {
      // Handle the success response
      const voters = response.teachers;
    //   console.log(voters)
      // Populate the voters list in the popup
      // (Assuming you have a <ul> element with the ID "votersList")
      const votersList = $("#votersList");
      votersList.empty();
      voters.forEach((voter) => {
        votersList.append(
          `<li><input type="checkbox" name="voter" value="${voter.id}">${voter.name}</li>`
        );
      });
    },
    error: function () {
      // Handle the error response
      Swal.fire("Error", "Failed to fetch voters.", "error");
    },
  });
}




// Function to create a new chat room
function createNewChat() {
    
    // Get the token from localStorage
    const token = localStorage.getItem("token");
  
    // Decode the token to retrieve the payload
    const tokenPayload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    // console.log(decodedPayload);
  
    // Extract the admin_id from the decoded payload
    const admin_id = decodedPayload.id; 



  var chatroomName = $("#chatroomName").val().trim();
  var allVoters = $('#selectAllTeachers').prop('checked');
    var selectedVoters = $('input[name="voter"]:checked')
      .map(function () {
        return parseInt($(this).val());
      })
      .get();
 

    // Append admin_id to the formData
        const formData = {
          room_name: $("#chatroomName").val().trim(),
          allVoters: $('#selectAllTeachers').prop('checked'),
          selectedVoters: $('input[name="voter"]:checked').map(function() {
            return this.value;
          }).get(),
          admin_id: admin_id
        };
    // Perform validation on chatroomName and selectedVoters if required
    if (!chatroomName || selectedVoters.length === 0) {
      // Return an error if any field is left empty
      Swal.fire("Error", "Please fill in all the required fields.", "error");
      return;
    }
  
    // Check if chatroomName exceeds the character limit
    if (chatroomName.length > 15) {
      Swal.fire("Error", "Chatroom name cannot exceed 15 characters.", "error");
      return;
    }
  
  
    // Code to send the data 
    $.ajax({
      url: `${baseurl}/admin/new-chat-room`,
      type: "POST",
      data: JSON.stringify(formData),
      contentType: 'application/json',
      headers: {
        Authorization: "Bearer " + token, 
      },
      success: function (response) {
        // Handle the success response
        Swal.fire({
          title: 'Success',
          text: 'Chatroom created successfully!',
          icon: 'success',
        }).then((result) => {
          if (result.isConfirmed || result.isDismissed) {
            // Clear the modal and reset the form
            $('#chatModal').modal('hide');
            $('#chatroomName').val('');
            $('input[name="voter"]').prop('checked', false);
            $('#selectAllCheckbox').prop('checked', false);
  
            // Refresh the page
            window.location.reload();
          }
        });
      },
      error: function (error) {
        console.log(error);
        // Handle the error response
        Swal.fire("Error", "Failed to create chatroom.", "error");
      },
    });
  }


$(document).ready(function () {
  // Attach click event handler to the "New Chat" button
  $("#newChatButton").click(function () {
    // Open the chat popup
    $("#chatModal").modal("show");
    // Fetch voters from the backend API and populate the list in the popup
    fetchVoters(); 
  });

  // Attach click event handler to the "Select All" checkbox
  $(document).on("click", "#selectAllCheckbox", function () {
    const isChecked = $(this).prop("checked");
    $('input[name="voter"]').prop("checked", isChecked);
  });

  // Attach click event handler to the "Create Chat" button in the popup
  $("#createChatBtn").click(function () {
    // Call the function to create a new chat
    createNewChat();
    // Close the chat popup
    $("#chatModal").modal("hide");
  });
});

$(document).ready(function () {
  // Fetch chat rooms on page load
  fetchChatRooms();

  // Attach click event handler to the "New Chat" button
  $("#newChatButton").click(function () {
    // Open the chat popup
    $("#chatModal").modal("show");
    // Fetch voters from the backend API and populate the list in the popup
    fetchVoters(); 
  });

  // Attach click event handler to the "Select All" checkbox
  $(document).on("click", "#selectAllCheckbox", function () {
    const isChecked = $(this).prop("checked");
    $('input[name="voter"]').prop("checked", isChecked);
  });

  // Attach click event handler to the "Create Chat" button in the popup
  $("#createChatBtn").click(function () {
    // Call the function to create a new chat
    // createNewChat();
    // Close the chat popup
    $("#chatModal").modal("hide");
  });
});













// Function to fetch chat room messages for a specific chat room
function fetchChatRoomMessages(chatRoomID) {
  // Get the sender_id from the token stored in localStorage
  const token = localStorage.getItem("token");
  const tokenPayload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(tokenPayload));
  const sender_id = decodedPayload.id;
  console.log(sender_id);
  // Make a GET request to fetch chat room messages
  $.ajax({
    url: `${baseurl}/chat-room-history/${chatRoomID}`, 
    type: "GET",
    dataType: "json",
        headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token') // Include token in the authorization header
    },
    success: function (response) {
      // Handle the success response
      const messages = response.messages;
      const chatMessages = $(".chat-messages");
      chatMessages.empty();

      if (messages.length > 0) {
        messages.forEach((message) => {
          // Check if the message is sent by the current user (You)
          const isSentByMe = message.sender_id === sender_id;

          // Display the sender's name and message
          const senderName = isSentByMe ? "You" : message.sender_name;
          let messageContent = `
              <div class="chat-message ${
                isSentByMe ? "sent-by-me" : "received"
              }">
              
                <span class="message-sender text-success">${senderName}</span>
                <br>
                <span class="message-text">${message.message}</span>
                <span class="message-timestamp">${moment(
                  message.timestamp
                ).format("LLL")}</span>
              </div>
            `;

          // Add attachments, if any
          if (message.attachments && message.attachments.length > 0) {
            messageContent += "<div>Attachments:";
            message.attachments.forEach((attachment) => {
              messageContent += `<a href="${attachment.file_path}" target="_blank">${attachment.file_name}</a> `;
            });
            messageContent += "</div>";
          }

//  // Check if the message has attachments
//  if (message.attachments && message.attachments.length > 0) {
//     messageContent += `<div class="message-attachments">`;

//     message.attachments.forEach((attachment) => {
//       // Check if it's an MP4 file to display it within the chatbox
//       if (attachment.file_name.endsWith(".mp4")) {
//         messageContent += `
//           <video width="320" height="240" controls preload="metadata" class="mt-2">
//             <source src="${attachment.file_path}" type="video/mp4">
//             Your browser does not support the video tag.
//           </video>
//         `;
//       } else {
//         // Check if it's other than an MP4 file to display it within the chatbox
//         const supportedFileExtensions = [
//           'txt', 'doc', 'docx', 'xls', 'xlsx', 'pdf', 'png', 'jpeg', 'jpg', 'mp3', 'wav', 'mp4', 'mpeg', 'mpga'
//         ];

//         const fileExtension = attachment.file_name.split('.').pop().toLowerCase();
//         if (supportedFileExtensions.includes(fileExtension)) {
//           messageContent += `
//           <img src="${attachment.file_path}" alt="${attachment.file_name}" class="img-fluid img-thumbnail rounded mt-2">


               

//           `;
//         } else {
//           // For other attachments, display as links
//           messageContent += `
//             <a href="${attachment.file_path}" target="_blank">${attachment.file_name}</a>
//           `;
//         }
//       }
//     });

//     messageContent += `</div>`;
//   }

          chatMessages.append(messageContent);
        });
         // Scroll to the latest message after the messages are loaded
         chatMessages.scrollTop(chatMessages[0].scrollHeight);
      } else {
        // Show message if no messages are found for the chat room
        chatMessages.append("<div>No messages in this chat room.</div>");
      }
    },
    error: function (error) {
      // Handle the error response
      console.log(error);
    },
  });
  
}






  
  




// Function to send a message to the backend API
function sendMessage(chatroomID, message) {
  // Get the sender_id from the token stored in localStorage
  const token = localStorage.getItem("token");
  const tokenPayload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(tokenPayload));
  const sender_id = decodedPayload.id;
  console.log(sender_id);

  // Code to send the data to your backend API to send a new message
  $.ajax({
    url: `${baseurl}/send-message`,
    type: "POST",
    data: {
      sender_id: sender_id,
      chatroomID: chatroomID,
      message: message,
   
    },
    dataType: "json",
    headers: {
      Authorization: "Bearer " + token, 
    },
    success: function (response) {
      // Handle the success response
    //   console.log("Message sent successfully:", response.message);
      // Fetch chat room messages again to update the chat box with the new message
      fetchChatRoomMessages(chatroomID);
      console.log(chatroomID)
    },
    error: function (error) {
      // Handle the error response
      console.log("Failed to send message:", error);
    },
  });
}






// Function to send a message to the backend API
function sendAttachment(chatroomID,files,messag) {
    // Get the sender_id from the token stored in localStorage
    const token = localStorage.getItem("token");
    const tokenPayload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    const sender_id = decodedPayload.id;
    // console.log(sender_id);

     // Create a new FormData object to include the message and file data
  const formData = new FormData();
  formData.append("sender_id", sender_id);
  formData.append("chatroomID", chatroomID);
  formData.append("message", "Please find the attachment below");

  // Append each file to the FormData object
  for (const file of files) {
    formData.append("attachment", file);
  }

  
    // Code to send the data to your backend API to send a new message
    $.ajax({
      url: `${baseurl}/admin/message-attachments`,
      type: "POST",
      data: formData,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token, 
      },
      processData: false, // Prevent jQuery from processing the data
    contentType: false, // Prevent jQuery from setting content type
    success: function (response) {
      // Handle the success response
      // Fetch chat room messages again to update the chat box with the new message
      fetchChatRoomMessages(chatroomID);
    },
    error: function (error) {
      // Handle the error response
      console.log("Failed to send message:", error);
    },
  });
}
  






// Function to display the chat box for a specific chat room
function displayChatBox(chatRoomID, chatRoomName) {
    console.log(chatRoomName)
    const chatBox = $(".chat-box");
    chatBox.show();

    // const chatMessages = chatBox.find(".chat-messages");
    // chatMessages.html(`<h3>${chatRoomName}</h3>`);

    // Set the chat room name at the top of the chat box
chatBox.find(".chat-room-name").text(chatRoomName);

const chatMessages = chatBox.find(".chat-messages");

    // Clear the previous messages, if any
    chatMessages.empty();

    // Fetch chat room messages for the selected chat room
    fetchChatRoomMessages(chatRoomID);

    // Handle the "Send" button click event
    $("#sendMessageBtn")
      .off("click")
      .on("click", function () {
        const message = $("#messageInput").val().trim();
        if (message !== "") {
          // Call the function to send the message
          sendMessage(chatRoomID, message);
          // Clear the message input after sending the message
          $("#messageInput").val("");
        }
      });

 // Handle the "Send" button click event
 $("#sendMessageBtn").off("click").on("click", function () {
    const files = $("#fileInput")[0].files;
    console.log(files);
  
    // Call the function to send the message with attachments
    sendAttachment(chatRoomID, files);
  
    // Clear the file input field and displayed file names after sending the message
    $("#fileInput").val("");
    $("#selectedFilesDiv").text("");
  });
  

  // Handle the "Close" button click event
  $("#closeChatBox").on("click", function () {
    chatBox.hide();
  });

  // Handle the "change" event of the file input
  $("#fileInput").on("change", function () {
    // Get the selected files
    const files = $(this)[0].files;
    // Display the selected file names
    const fileNames = Array.from(files).map(file => file.name).join(", ");
    $("#selectedFilesDiv").text(fileNames);
  });
      

      
  // Attach keypress event listener to the message input field
  $("#messageInput").on("keypress", function (event) {
    // Check if the pressed key is Enter (keyCode 13)
    if (event.keyCode === 13) {
      // Prevent the default behavior (e.g., form submission)
      event.preventDefault();
      // Get the message content from the input field
      const message = $(this).val().trim();
      if (message !== "") {
        // Get the chat room ID from your logic or data attributes
        
        // Call the function to send the message
        sendMessage(chatRoomID, message);
        // Clear the message input after sending the message
        $(this).val("");
      }
    }
  });

$("#messageInput").on("keypress", function (event) {
    // Check if the pressed key is Enter (keyCode 13)
    if (event.keyCode === 13) {
      // Prevent the default behavior (e.g., form submission)
      event.preventDefault();
      const files = $("#fileInput")[0].files; // Assuming you have an input field for file selection with the ID "fileInput"
  
      if (files.length > 0) {
        // Call the function to send the message with attachments
        sendAttachment(chatRoomID, null, files); 
        $("#fileInput").val(""); // Clear the file input field after sending the message
      }
    }
  });
  
  


    // Handle the "Close" button click event
    $("#closeChatBox").on("click", function () {
      chatBox.hide();
    });
  }



// Attach click event handler to the chat rooms
$(document).on("click", ".chat-rooms-list > div", function () {
  const chatRoomID = $(this).data("chatroom-id");
  const chatRoomName = $(this).text();
  displayChatBox(chatRoomID, chatRoomName);
});



// Fetch chat rooms on page load
fetchChatRooms();


