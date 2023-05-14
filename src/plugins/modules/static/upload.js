$(document).ready(() => {
  // run once on startup
  $('#send4').hide();
  $('#form').submit(e => {
    e.preventDefault();
  });

  // checking helpers
  function addWarning(item, type, message) {
    item.addClass('form-control-warning');
    item.removeClass('form-control-success');
    item.parent().addClass('has-warning');
    item.parent().removeClass('has-success');
    if ($(`#${type}-feedback`).length === 0) {
      item.after(`<div class="form-control-feedback" id="${type}-feedback">${message}</div>`);
    }
  }

  function addSuccess(item, type) {
    item.removeClass('form-control-warning');
    item.addClass('form-control-success');
    item.parent().addClass('has-success');
    item.parent().removeClass('has-warning');
    $(`#${type}-feedback`).remove();
  }

  $('#password').keyup(() => {
    let item = $('#password');
    let title = item.val();

    // preform checks
    if (password.length === 0) {
      addWarning(item, 'title', 'title cannot be empty');
    } else {
      addSuccess(item, 'title');
    }

  });
  //when file is changed and password is entered and id is entered a button will appear
  $(document).ready(function() {
    $('#file, #password, #other_text').on('input', function() {
      let file = $('#file')[0].files[0];
      let password = $('#password').val();
      let id = $('#other_text').val();
      //make it checks if id and password are entered and then check if file has changed
      if (password && id) {
        if(file) {
          $('#send4').show();
        }
      }
    });
  });
  
    
  $('#file').on('change', function() {
    let item = $(this);
    //calculate the size of the file
    let size = item[0].files[0].size;
    //print size to embed preview
    $('#size').text(size);
    //limit the size to 100mb
    if (size > 100000000) {
      //if it is, add a warning
      addWarning(item, 'file', 'file is too big');
    } else {
      //if it is not, add a success
      addSuccess(item, 'file');
    }
  });
  $('#send4').click(e => {
      e.preventDefault();
      //hide button
      $('#send4').hide();
      let password = $('#password').val();
      let id = $('#other_text').val();
      //then get the file from the form
      let file = $('#file')[0].files[0];
      //convert file to base64
      let reader = new FileReader();
      $('#file').val('');
      reader.readAsDataURL(file);
      reader.onload = function () {
          //console log the base64
          console.log(reader.result);
          //change it so it can be in json like {"file": reader.result}
          reader.result = JSON.stringify({ file: reader.result });
          //send the base64 to the server
          $.ajax({
              url: '/upload/' + password + '/' + id,
              type: 'POST',
              data: {
                  file: reader.result
              },
              success: function (data) {
                  console.log(data);
              }
          });
      };
      reader.onerror = function (error) {
          console.log('Error: ', error);
      };
  });
});