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
  
  
  
  
  
  
  
  
  
  
  
  
  
  // // Function to fetch chat room messages for a specific chat room
  // function fetchChatRoomMessages(chatRoomID) {
  //   // Get the sender_id from the token stored in localStorage
  //   const token = localStorage.getItem("token");
  //   const tokenPayload = token.split(".")[1];
  //   const decodedPayload = JSON.parse(atob(tokenPayload));
  //   const sender_id = decodedPayload.id;
  //   // console.log(sender_id);
  
  
     
  
  //   // Make a GET request to fetch chat room messages
  //   $.ajax({
  //     url: `${baseurl}/chat-room-history/${chatRoomID}`, 
  //     type: "GET",
  //     dataType: "json",
  //     headers: {
  //       Authorization: "Bearer " + token, 
  //     },
  //     success: function (response) {
  //       // Handle the success response
  //       const messages = response.messages;
  //       const chatMessages = $(".chat-messages");
  //       chatMessages.empty();
  
  //         // Get the attachment button element
  //         const attachmentBtn = document.getElementById("attachmentBtn");
  
  //         console.log(attachmentBtn)
  
        
  
  //       if (messages.length > 0) {
          
  //         messages.forEach((message) => {
  //           // Check if the message is sent by the current user (You)
  //           const isSentByMe = message.sender_id === sender_id;
  
  //           // Display the sender's name and message
  //           const senderName = isSentByMe ? "You" : message.sender_name;
  //           let messageContent = `
  //               <div class="chat-message ${
  //                 isSentByMe ? "sent-by-me" : "received"
  //               }">
                
  //                 <span class="message-sender text-success">${senderName}</span>
  //                 <br>
  //                 <span class="message-text">${message.message}</span>
  //                 <span class="message-timestamp">${moment(
  //                   message.timestamp
  //                 ).format("LLL")}</span>
  //               </div>
  //             `;
  
  //           // Add attachments, if any
  //           if (message.attachments && message.attachments.length > 0) {
  //             messageContent += "<div>Attachments:";
  //             message.attachments.forEach((attachment) => {
  //               messageContent += `<a href="${attachment.file_path}" target="_blank">${attachment.file_name}</a> `;
  //             });
  //             messageContent += "</div>";
  //           }
  
  // //  // Check if the message has attachments
  // //  if (message.attachments && message.attachments.length > 0) {
  // //     messageContent += `<div class="message-attachments">`;
  
  // //     message.attachments.forEach((attachment) => {
  // //       // Check if it's an MP4 file to display it within the chatbox
  // //       if (attachment.file_name.endsWith(".mp4")) {
  // //         messageContent += `
  // //           <video width="320" height="240" controls preload="metadata" class="mt-2">
  // //             <source src="${attachment.file_path}" type="video/mp4">
  // //             Your browser does not support the video tag.
  // //           </video>
  // //         `;
  // //       } else {
  // //         // Check if it's other than an MP4 file to display it within the chatbox
  // //         const supportedFileExtensions = [
  // //           'txt', 'doc', 'docx', 'xls', 'xlsx', 'pdf', 'png', 'jpeg', 'jpg', 'mp3', 'wav', 'mp4', 'mpeg', 'mpga'
  // //         ];
  
  // //         const fileExtension = attachment.file_name.split('.').pop().toLowerCase();
  // //         if (supportedFileExtensions.includes(fileExtension)) {
  // //           messageContent += `
  // //           <img src="${attachment.file_path}" alt="${attachment.file_name}" class="img-fluid img-thumbnail rounded mt-2">
  
  
                 
  
  // //           `;
  // //         } else {
  // //           // For other attachments, display as links
  // //           messageContent += `
  // //             <a href="${attachment.file_path}" target="_blank">${attachment.file_name}</a>
  // //           `;
  // //         }
  // //       }
  // //     });
  
  // //     messageContent += `</div>`;
  // //   }
  
  //           chatMessages.append(messageContent);
  //         });
  //          // Scroll to the latest message after the messages are loaded
  //          chatMessages.scrollTop(chatMessages[0].scrollHeight);
  //       }
  //        else {
  //         // Show message if no messages are found for the chat room
  //         chatMessages.append("<div>No messages in this chat room.</div>");
  //       }
  //     },
  //     error: function (error) {
  //       // Handle the error response
  //       console.log(error);
  //     },
  //   });
    
  // }
  
  
  // Function to fetch chat room messages for a specific chat room
  function fetchChatRoomMessages(chatRoomID) {
    // Get the sender_id from the token stored in localStorage
    const token = localStorage.getItem("token");
    const tokenPayload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    const sender_id = decodedPayload.id;
    console.log(sender_id);
  
    // Get the attachmentBtn element
    const attachmentBtn = document.getElementById("fileUploadForm");
  
    // Make a GET request to fetch chat room messages
    $.ajax({
      url: `${baseurl}/chat-room-history/${chatRoomID}`,
      type: "GET",
      dataType: "json",
      headers: {
        Authorization: "Bearer " + token,
      },
      success: function (response) {
        // Handle the success response
        const messages = response.messages;
        const chatMessages = $(".chat-messages");
        chatMessages.empty();
  
        if (messages.length > 0) {
          let totalAttachments = 0; // Variable to store the total number of attachments in the chatroom
  
          messages.forEach((message) => {
            // Count the attachments in each message
            if (message.attachments && message.attachments.length > 0) {
              totalAttachments += message.attachments.length;
            }
  
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
  
            chatMessages.append(messageContent);
          });
  
          // Check the total number of attachments in the chatroom
          if (totalAttachments === 1) {
            attachmentBtn.classList.add("d-none"); // Hide the attachmentBtn when there is a single attachment
          } else {
            attachmentBtn.classList.remove("d-none"); // Show the attachmentBtn when there are no attachments or multiple attachments
          }
  
          // Scroll to the latest message after the messages are loaded
          chatMessages.scrollTop(chatMessages[0].scrollHeight);
        } else {
          // Show message if no messages are found for the chat room
          chatMessages.append("<div>No messages in this chat room.</div>");
          attachmentBtn.classList.add("d-none"); // Hide the attachmentBtn when there are no messages
        }
      },
      error: function (error) {
        // Handle the error response
        console.log(error);
      },
    });
  }
  
  
  
  
    
    
  
  
  
  
  function sendMessage(chatroomID, message) {
    // Get the sender_id from the token stored in localStorage
    const token = localStorage.getItem("token");
    const tokenPayload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    const sender_id = decodedPayload.id;
  
    // Get the message input field
    const messageInput = document.getElementById("messageInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");
  
    // Validate the message before sending
    if (!message || message.trim() === "") {
      // Add Bootstrap class to show red border
      messageInput.classList.add("is-invalid");
  
      // Set focus on the message input field
      messageInput.focus();
  
      return; // Exit the function if the message is blank
    } else {
      // Remove the Bootstrap class if the message is filled
      messageInput.classList.remove("is-invalid");
    }
  
    // Disable the "Send" button and change its text to "Sending"
    sendMessageBtn.disabled = true;
    sendMessageBtn.textContent = "Sending...";
  
    // Code to send the data to your backend API to send a new message
    fetch(`${baseurl}/send-message`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_id: sender_id,
        chatroomID: chatroomID,
        message: message,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send message.");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the success response
        fetchChatRoomMessages(chatroomID);
  
        // Re-enable the "Send" button and change its text back to "Send"
        sendMessageBtn.disabled = false;
        sendMessageBtn.textContent = "Send";
      })
      .catch((error) => {
        // Handle the error response
        console.error("Failed to send message:", error);
  
        // Re-enable the "Send" button and change its text back to "Send"
        sendMessageBtn.disabled = false;
        sendMessageBtn.textContent = "Send";
      });
  }
  
  // Add event listener for "input" event to remove error when user types in the textarea
  document.getElementById("messageInput").addEventListener("input", function () {
    const messageInput = this;
    if (messageInput.value && messageInput.value.trim() !== "") {
      messageInput.classList.remove("is-invalid");
    }
  });
  
  
  
  
  
  // send message with attachments
  
  function sendAttachment(chatroomID, files, message) {
    // Get the sender_id from the token stored in localStorage
    const token = localStorage.getItem("token");
    const tokenPayload = token.split(".")[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    const sender_id = decodedPayload.id;
  
    // Get the message input field
    const messageInput = document.getElementById("messageInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn"); 
  
    // Validate the message before sending
    if (!message || message.trim() === "") {
      // Add Bootstrap class to show red border
      messageInput.classList.add("is-invalid");
  
      // Set focus on the message input field
      messageInput.focus();
  
      return; // Exit the function if the message is blank
    } else {
      // Remove the Bootstrap class if the message is filled
      messageInput.classList.remove("is-invalid");
    }
  
    // Disable the "Send" button and change its text to "Sending"
    sendMessageBtn.disabled = true;
    sendMessageBtn.textContent = "Sending...";
  
    // Create a new FormData object to include the message and file data
    const formData = new FormData();
    formData.append("sender_id", sender_id);
    formData.append("chatroomID", chatroomID);
    formData.append("message", message);
  
    // Append each file to the FormData object
    for (const file of files) {
      formData.append("attachment", file);
    }
  
    // Code to send the data to your backend API to send a new message with attachments
    fetch(`${baseurl}/admin/message-attachments`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send message with attachment.");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the success response
        fetchChatRoomMessages(chatroomID);
  
        // Re-enable the "Send" button and change its text back to "Send"
        sendMessageBtn.disabled = false;
        sendMessageBtn.textContent = "Send";
  
        // Clear the message input and file input after sending the message
        messageInput.value = "";
        const fileInput = document.getElementById("fileInput");
        fileInput.value = "";
        const selectedFilesDiv = document.getElementById("selectedFilesDiv");
        selectedFilesDiv.textContent = "";
      })
      .catch((error) => {
        // Handle the error response
        console.error("Failed to send message with attachment:", error);
  
        // Re-enable the "Send" button and change its text back to "Send"
        sendMessageBtn.disabled = false;
        sendMessageBtn.textContent = "Send";
      });
  }
  
  
  
  
  // Function to display the chat box for a specific chat room
  function displayChatBox(chatRoomID, chatRoomName) {
    console.log(chatRoomName);
    const chatBox = $(".chat-box");
    chatBox.show();
  
    chatBox.find(".chat-room-name").text(chatRoomName);
  
    const chatMessages = chatBox.find(".chat-messages");
    chatMessages.empty();
  
    // Fetch chat room messages for the selected chat room
    fetchChatRoomMessages(chatRoomID);
  
    // Handle the "Send" button click event
    $("#sendMessageBtn").off("click").on("click", function () {
      const message = $("#messageInput").val().trim();
      const files = $("#fileInput")[0].files; 
  
      
    // Check if the user entered a message and call the function to send the message with attachments
    if (message !== "") {
      sendAttachment(chatRoomID, files, message);
    } else {
      alert("Please enter a message before sending.");
    }
      handleSendMessage(chatRoomID, message, files);
  
      // Clear the message input and file input after sending the message
      $("#messageInput").val("");
      $("#fileInput").val("");
      $("#selectedFilesDiv").text("");
    });
  
  
    
  
    // Handle the "Close" button click event
    $("#closeChatBox").on("click", function () {
      chatBox.hide();
    });
  
    // Handle the "change" event of the file input
    $("#fileInput").on("change", function () {
      const files = $(this)[0].files;
      // Display the selected file names
      const fileNames = Array.from(files).map((file) => file.name).join(", ");
      $("#selectedFilesDiv").text(fileNames);
    });
  
  
  $("#messageInput").on("keypress", function (event) {
    // Check if the pressed key is Enter (keyCode 13)
    if (event.keyCode === 13) {
      // Prevent the default behavior (e.g., form submission)
      event.preventDefault();
      const message = $(this).val().trim();
      const files = $("#fileInput")[0].files; // Assuming you have an input field for file selection with the ID "fileInput"
  
      if (files.length > 0) {
        // Call the function to send the message with attachments
        sendAttachment(chatRoomID, files, message);
        // Clear the message input and file input after sending the message
        $(this).val("");
        $("#fileInput").val("");
        $("#selectedFilesDiv").text("");
      } else {
        // Check if the user entered a message before sending
        if (message !== "") {
          // Call the function to send the regular text message
          sendMessage(chatRoomID, message);
          // Clear the message input after sending the message
          $(this).val("");
        } else {
          alert("Please enter a message before sending.");
        }
      }
    }
  });
  
  
  
  
  }
  
  // Function to handle sending messages with attachments or regular text messages
  function handleSendMessage(chatRoomID, message, files) {
    if (files.length > 0) {
      // Call the function to send the message with attachments
      sendAttachment(chatRoomID, message,files);
    } else {
      // Call the function to send the regular text message
      sendMessage(chatRoomID, message);
    }
  }
  
  // Attach click event handler to the chat rooms
  $(document).on("click", ".chat-rooms-list > div", function () {
    const chatRoomID = $(this).data("chatroom-id");
    const chatRoomName = $(this).text();
    displayChatBox(chatRoomID, chatRoomName);
  });
  
  // Fetch chat rooms on page load
  fetchChatRooms();
  
  