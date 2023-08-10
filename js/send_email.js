        
        
        
        let quill;
        // Function to initialize the Quill editor
        function initializeQuillEditor() {
          return new Quill('#message', {
           
            theme: 'snow'
          });
        }
  
  
  
  
    // Function to fetch all voters from the API and display them on the left side
    function fetchAllVoters() {
      $.ajax({
        url: `${baseurl}/get-all-voters`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          // Handle the response and display voters on the left side
          const votersList = $('#votersList');
          votersList.empty();
  
          data.voters.forEach((voter) => {
            votersList.append(`
              <li class="list-group-item">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="${voter.voter_email}" name="selectedVoters">
                  <label class="form-check-label ">${voter.voter_name}</label>
                  <br>
                  <small class="text-primary">[ ${voter.voter_email} ]<small/>
                </div>
              </li>
            `);
          });
  
          // Add a "Select All" checkbox at the top
          votersList.prepend(`
            <li class="list-group-item">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="selectAll">
                <label class="form-check-label font-weight-bold">Select All</label>
              </div>
            </li>
          `);
  
          // Add event listener to "Select All" checkbox
          $('#selectAll').change(function () {
            const isChecked = this.checked;
            $('input[name="selectedVoters"]').prop('checked', isChecked);
          });
        },
        error: function (error) {
          console.error('Error fetching voters:', error);
          // Handle error here (display an error message, etc.)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch voters. Please try again later.',
          });
        },
      });
    }
  
    // Function to handle form submission and send email to selected voters
    $('#sendEmailBtn').click(function (e) {
      e.preventDefault();
      // Gather form data
      const subject = $('#subject').val();
      // const message = $('#message').val();
      const message = quill.getText(); 
      const attachments = $('#attachments')[0].files;
  
      // Get selected voters' email addresses
      const selectedVoters = $('input[name="selectedVoters"]:checked').map(function () {
        return this.value;
      }).get();
  
      // Validate form fields
      if (!subject || !message || selectedVoters.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please fill in all the required fields and select at least one voter to send the email.',
        });
        return false; // Prevent default form submission behavior
      }
  
      // Prepare form data for sending email via API
      const formData = new FormData();
      formData.append('sendTo', 'selected'); // Send to selected voters
      formData.append('subject', subject);
      formData.append('text', message);
  
      for (let i = 0; i < attachments.length; i++) {
        formData.append('attachments', attachments[i]);
      }
  
      // Add email addresses of selected voters
      formData.append('selectedVoters', selectedVoters.join(','));
  
      // Show the SweetAlert2 loader with a "Sending Email" message
      Swal.fire({
        title: 'Sending Email',
        html: 'Please wait...',
        allowOutsideClick: false,
        didOpen: async () => {
          Swal.showLoading();
          try {
            // Send email to selected voters
            await $.ajax({
              url: `${baseurl}/send-emails`,
              type: 'POST',
              data: formData,
              processData: false,
              contentType: false,
            });
            
            // Clear form fields after success
            $('#subject').val('');
            // $('#message').val('');
            quill.setText('');
            $('input[name="selectedVoters"]').prop('checked', false);
  
            // Clear file input field
            $('#attachments').val('');
  
            // Close the loader and show a success message
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Email sent successfully.',
            });
          } catch (error) {
            console.error('Error sending email:', error);
            // Handle error here (display an error message, etc.)
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to send email. Please try again later.',
            });
          }
        },
      });
  
      return false; // Prevent default form submission behavior
    });
  
    // Fetch voters when the page loads
    $(document).ready(function () {
      quill = initializeQuillEditor();
      fetchAllVoters();
     
    });
  