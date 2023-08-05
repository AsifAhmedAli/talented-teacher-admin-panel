
    $(document).ready(function () {
      $("#loginForm").submit(function (event) {
        event.preventDefault();
  
        const email = $("#inputEmail").val();
        const password = $("#inputPassword").val();
        const loginData = { email, password };
  
        $.ajax({
          type: "POST",
          url: `${baseurl}/admin/login`, // Replace with the correct API endpoint
          dataType: "json",
          contentType: "application/json",
          data: JSON.stringify(loginData),
          success: function (data) {
            // If the login is successful, redirect to another page or perform other actions.
            // console.log("Login successful!", data);
            // console.log(data.expirationDate);
            // console.log(localStorage.getItem("token"))
            localStorage.setItem("token", data.token);

  
            // Save the token in a cookie with expiration time
            const expirationDate = new Date(data.expirationDate);
            document.cookie = `token=${data.token}; expires=${expirationDate.toUTCString()}; path=/;`;
  
            // Check if the token has expired
            const currentDate = new Date();
            if (currentDate > expirationDate) {
              // Token has expired, remove it from local storage
              localStorage.removeItem("token");
  
              // Redirect the user to the login page
              window.location.href = "./login.html";
            } else {
              // Token is still valid, proceed to another page (e.g., dashboard)
              window.location.href = "./all_teachers.html";
            }
          },
          error: function (error) {
            console.error("Login failed:", error);
  
            // Display an error message to the user, indicating login failure
            const errorMessage = $("<div>").addClass("alert alert-danger").text("Invalid email or password");
            $("body").prepend(errorMessage);
          },
        });
      });
    });
