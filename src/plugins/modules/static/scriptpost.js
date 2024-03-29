$(document).ready(() => {
  let switches = {
    title: false,
    url: false,
    icon: false };


  let fields = 1;

  let source = ``;

  let embed = {
    title: 'Embed title (required)',
    author: {
      name: '',
      url: '',
      icon: '' },

    description: '',
    url: '',
    thumb_url: '',
    color: '',
    fields: [{}],


    footer: '' };


  function resetEmbed() {
    $('.embed-inner').html('');
    $('.embed-footer').remove();
    $('.embed-thumb').remove();
  }

  function updateEmbed(embed) {
    resetEmbed();

    // add basic embed generation to source
    source = `disabled`;

    if (embed.url) {
      $('.embed-inner').append(`<div class="embed-title"><a href="${embed.url}">${embed.title}</a></div>`);

      // update source
      source += `title="${embed.title}", url='${embed.url}'`;
    } else {
      $('.embed-inner').append(`<div class="embed-title">${embed.title}</div>`);

      // update source
      source += `title="${embed.title}"`;
    }

    if (embed.description) {
      $('.embed-inner').append(`<div class="embed-description">${embed.description}</div>`);

      // update source
      source += `, description="${embed.description}"`;
    }

    if (embed.color) {
      $('.side-colored').css('background-color', embed.color);

      // update source
      source += `, color=0x${embed.color.substr(1)}`;
    }

    // finished the basic setup
    source += `)\n`;

    if (embed.author.name) {
      // add author to source
      source += `embed.set_author(`;

      $('.embed-title').before(`<div class="embed-author"><a class="embed-author-name" href="${embed.author.url}">${embed.author.name}</a></div>`);

      // update source
      source += `name="${embed.author.name}"${embed.author.url && `, url='${embed.author.url}'`}`;
      if (embed.author.icon) {
        $('.embed-author-name').before(`<img class="embed-author-icon" src="${embed.author.icon}" />`);

        // update source
        source += `, icon_url='${embed.author.icon}'`;
      }

      // finish author
      source += `)\n`;
    }

    if (embed.thumb_url) {
      // add thumbnail
      source += `embed.set_thumbnail(`;

      $('.card.embed .card-block').append(`<img class="embed-thumb" src="${embed.thumb_url}" />`);
      $('.embed-thumb').height($('.embed-thumb')[0].naturalHeight);

      // update source
      source += `url='${embed.thumb_url}'`;

      // finish thumbnail
      source += `)\n`;
    }

    if (embed.fields.length > 0) {
      $('.embed-inner').append(`<div class="fields"></div>`);
    }

    for (let field of embed.fields) {
      $('.embed-inner .fields').append(`
        <div class="field ${field.inline && 'inline'}">
          <div class="field-name">${field.name}</div>
          <div class="field-value">${field.value}</div>
        </div>
      `);

      // add field
      source += `embed.add_field(name="${field.name}", value="${field.value}", inline=${field.inline && 'True' || 'False'})\n`;
    }

    if (embed.footer) {
      $('.card.embed').append(`<div class="embed-footer"><span>${embed.footer}</span></div>`);

      // add footer
      source += `embed.set_footer(text="${embed.footer}")\n`;
    }

    // add send function
    source += `await self.bot.say(embed=embed)\n`;

    // code
    $('.source').text(source);
    hljs.highlightBlock($('.source')[0]);
  }

  // run once on startup
  updateEmbed(embed);

  function generateInputFields(fields) {
    // generate inputs for fields
    $('.input-fields').html('');
    for (let i = 0; i < fields; i++) {
      $('.input-fields').append(`<div class="form-group row">
        <div class="col-sm-4">
          <input class="form-control" id="field-${i}-name" type="text" placeholder="name" value="${embed.fields[i].name !== undefined ? embed.fields[i].name : ''}" />
        </div>
        <div class="col-sm-4">
          <input class="form-control" id="field-${i}-value" type="text" placeholder="value" value="${embed.fields[i].value !== undefined ? embed.fields[i].value : ''}" />
        </div>
        <div class="col-sm-2">
          <div class="form-check">
            <label class="form-check-label">
              <input class="form-check-input" id="field-${i}-inline" type="checkbox" ${embed.fields[i].inline !== undefined ? 'checked="checked"' : ''}> Inline
            </label>
          </div>
        </div>
        <div class="col-sm-2">
          <button id="field-${i}-delete" class="btn btn-danger">Delete</button>
        </div>
      </div>`);
      $(`#field-${i}-name`).keyup(() => {
        updateFieldName(i, $(`#field-${i}-name`).val());
      });

      $(`#field-${i}-value`).keyup(() => {
        updateFieldValue(i, $(`#field-${i}-value`).val());
      });

      $(`#field-${i}-inline`).click(() => {
        updateFieldInline(i, $(`#field-${i}-inline`).is(':checked'));
      });

      $(`#field-${i}-delete`).click(e => {
        e.preventDefault();
        deleteField(i);
      });
    }
    $('.input-fields').append(`<button id="add-field" class="btn btn-success">Add field</button>`);
    $('#add-field').click(e => {
      e.preventDefault();
      addField();
    });
  }


  generateInputFields(fields);

  function updateFieldName(index, value) {
    embed.fields[index].name = value;
    updateEmbed(embed);
  }

  function updateFieldValue(index, value) {
    embed.fields[index].value = value;
    updateEmbed(embed);
  }

  function updateFieldInline(index, value) {
    embed.fields[index].inline = value;
    updateEmbed(embed);
  }

  function deleteField(index) {
    embed.fields.splice(index, 1);
    updateEmbed(embed);
    fields -= 1;
    generateInputFields(fields);
  }

  function addField() {
    embed.fields.push({ inline: true });
    fields += 1;
    generateInputFields(fields);
  }

  function updateTitle(value) {
    embed.title = value || '';
    updateEmbed(embed);
  }

  function updateUrl(value) {
    embed.url = value || '';
    updateEmbed(embed);
  }

  function updateThumb(value) {
    embed.thumb_url = value || false;
    updateEmbed(embed);
  }

  function updateDescription(value) {
    embed.description = value || '';
    updateEmbed(embed);
  }

  function updateColor(value) {
    embed.color = value || false;
    updateEmbed(embed);
  }

  function updateAuthorName(value) {
    embed.author.name = value || '';
    updateEmbed(embed);
  }

  function updateAuthorUrl(value) {
    embed.author.url = value || '';
    updateEmbed(embed);
  }

  function updateAuthorIcon(value) {
    embed.author.icon = value || '';
    updateEmbed(embed);
  }

  function updateFooter(value) {
    embed.footer = value || '';
    updateEmbed(embed);
  }

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

  $('#title').keyup(() => {
    let item = $('#title');
    let title = item.val();

    // preform checks
    if (title.length === 0) {
      addWarning(item, 'title', 'title cannot be empty');
    } else {
      addSuccess(item, 'title');
      // update
      updateTitle(title);
    }

  });

  $('#url').keyup(() => {
    let item = $('#url');
    let url = item.val();

    if (url.substr(0, 4) !== 'http' && url.length !== 0) {
      addWarning(item, 'url', 'not a valid url');
    } else {
      addSuccess(item, 'url');
      // update
      updateUrl(url);
    }


  });

  $('#icon').keyup(() => {
    let item = $('#icon');
    let icon = item.val();

    if (icon.substr(0, 4) !== 'http' && icon.length !== 0) {
      addWarning(item, 'icon', 'not a valid url');
    } else {
      addSuccess(item, 'icon');
      // update
      updateThumb(icon);
    }
  });

  $('#description').keyup(() => {
    let item = $('#description');
    let description = item.val();
    addSuccess(item, 'description');
    // update
    updateDescription(description);
  });

  $('#color').change(() => {
    updateColor($('#color').val());
  });

  $('#author_name').keyup(() => {
    let item = $('#author_name');
    let author_name = item.val();

    addSuccess(item, 'author_name');
    // update
    updateAuthorName(author_name);
  });

  $('#author_url').keyup(() => {
    let item = $('#author_url');
    let author_url = item.val();

    if (author_url.substr(0, 4) !== 'http' && author_url.length !== 0) {
      addWarning(item, 'author_url', 'not a valid url');
    } else {
      addSuccess(item, 'author_url');
      // update
      updateAuthorUrl(author_url);
    }
  });

  $('#author_icon').keyup(() => {
    let item = $('#author_icon');
    let author_icon = item.val();

    if (author_icon.substr(0, 4) !== 'http' && author_icon.length !== 0) {
      addWarning(item, 'author_icon', 'not a valid url');
    } else {
      addSuccess(item, 'author_icon');
      // update
      updateAuthorIcon(author_icon);
    }
  });


  $('#send1').click(e => {
        e.preventDefault();
        //console log every value
        console.log(embed);
        //get password from form
        let password = $('#password').val();
        //change form data to json
        let json = JSON.stringify(embed);
        //send json in body to server
        $.ajax({
            url: '/post/' + password + '/1',
            type: 'POST',
            data: json,
            contentType: 'application/json',
            success: function (data) {
                console.log(data);
            }
        });
    });

    $('#send2').click(e => {
        e.preventDefault();
        //console log every value
        console.log(embed);
        //get password from form
        let password = $('#password').val();
        //change form data to json
        let json = JSON.stringify(embed);
        //send json in body to server
        $.ajax({
            url: '/post/' + password + '/2',
            type: 'POST',
            data: json,
            contentType: 'application/json',
            success: function (data) {
                console.log(data);
            }
        });
    });

    $('#send3').click(e => {
        e.preventDefault();
        //console log every value
        console.log(embed);
        //get password from form
        let password = $('#password').val();
        //change form data to json
        let json = JSON.stringify(embed);
        //send json in body to server
        $.ajax({
            url: '/post/' + password + '/3',
            type: 'POST',
            data: json,
            contentType: 'application/json',
            success: function (data) {
                console.log(data);
            }
        });
    });
    

    $('#send4').click(e => {
        e.preventDefault();
        //console log every value
        console.log(embed);
        //get password from form
        let password = $('#password').val();
        let id = $('#other_text').val();
        //change form data to json
        let json = JSON.stringify(embed);
        //send json in body to server
        $.ajax({
            url: '/post/' + password + '/' + id,
            type: 'POST',
            data: json,
            contentType: 'application/json',
            success: function (data) {
                console.log(data);
            }
        });
    });
            

  $('#footer').keyup(() => {
    let item = $('#footer');
    let footer = item.val();

    addSuccess(item, 'footer');
    // update
    updateFooter(footer);
  });
});