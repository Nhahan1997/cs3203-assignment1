$(function() {
    //asignment2, question 9
    function test_print(){

         console.log(“test code”)

    }
    // GET all tweet
    $('#getAll-button').on('click', function() {
        //call showTweet function
        ShowTweet();
    });

    //GET all user's Id
    $('#getALL-users-id').on('click', function() {
        //call showID function
        ShowID();
    });

    //GET tweet given id
    $('table').on('click','.get-tweet-detail-button' , function() {
        let rowEl = $(this).closest('tr');
        let id = rowEl.find('.id').text();
        $.ajax({
            url:'temp/' + id,
            contentType: 'application/json',
            success:function(response){
                const tbodyEl = $('tbody');
                tbodyEl.html('');   //empty html
                response.temp.forEach(function(temp) {
                    tbodyEl.append('\
                    <tr>\
                    <td class="created_at">' + temp.created_at + '</td>\
                    <td class="text">' + temp.text + '</td>\
                    </tr>\
                    ');
                });
            }
        });
    });

    //CREAT/POST
    //catch when the form is submitted
    $('#create-form').on('submit', function(event){
        event.preventDefault();
        //get input from text field for text and id
        let textInput = $('#create-text-input');
        let idInput = $('#create-id-input');
        $.ajax({
            url:'/fileTweet',
            method: 'POST',
            contentType: 'application/json',
            //convert the text and id into a josn string
            data: JSON.stringify({ textInput: textInput.val(), idInput: idInput.val() }),
            success:function(response){
                //get the response from server
                console.log(response);
                //empty those input values
                textInput.val('');
                idInput.val('');
                //call getAll-button to bring out new table of tweet with new tweet created
                $('#getAll-button').click();

            }
        });
    });

    //PUT
    //when the update button is clicked, the information wont change when website is refreshed
    $('table').on('click','.update-screen-name', function(){
        //get the row where the button is clicked
        let rowEl = $(this).closest('tr');
        //find where the column of name in that row
        let name = rowEl.find('.name').text();
        //get new screen name from input text field
        let newName = rowEl.find('.screen_name').val();
        $.ajax({
            url:'/fileTweet/'+ name,
            method: 'PUT',
            contentType:'application/json',
            //convert the new screen  name into json string
            data: JSON.stringify({ newName: newName}),
            success: function(response) {
                console.log(response);
                //call getAll-user-id to print put table of user name, id with new screen name updated
                $('#getALL-users-id').click();
            }
        })

    });

    //DELETE
    //delete tweet with given id
    $('table').on('click', '.delete-button', function(){
        //get the row where the button is clicked
        let rowEl = $(this).closest('tr');
        //find the column of id in that row
        let id = rowEl.find('.id').text();
        $.ajax({
            url:'/fileTweet/'+id,
            method: 'DELETE',
            contentType: 'application/json',
            success:function(response){
                console.log(response);
                $('#getALL-users-id').click();
            }
        });
    });

    //function to show all tweet(text and created time)
    function ShowTweet(){
        $.ajax({
            url: '/fileTweet',
            contentType: 'application/json',
            success: function(response){
                const tbodyEl = $('tbody');
                tbodyEl.html('');   //empty html
                //loop through fileTweet to get all tweet
                response.fileTweet.forEach(function(fileTweet) {
                    //append the value into table created in index.html
                    tbodyEl.append('\
                    <tr>\
                    <td class="created_at">' + fileTweet.created_at + '</td>\
                    <td class="text">' + fileTweet.text + '</td>\
                    </tr>\
                    ');
                });
            }
        })
    }
    //function to show all user's name, id, and screen name. Also create delete, get
    //adn update buttons at the end of each row of user.
    function ShowID(){ 
        $.ajax({
            url: '/fileTweet',
            contentType: 'application/json',
            success: function(response){
                const tbodyEl = $('tbody');
                tbodyEl.html('');   //empty html
                //loop through fileTweet to get all tweet
                response.fileTweet.forEach(function(fileTweet) {
                    tbodyEl.append('\
                    <tr>\
                    <td class="id">' + fileTweet.id + '</td>\
                    <td class="name">' + fileTweet.name + '</td>\
                    <td><input type="text" class="screen_name" value="' + fileTweet.screen_name + '"></td>\
                    <td>\
                    <button class="delete-button">DELETE</button>\
                    <button class="get-tweet-detail-button">GET</button>\
                    <button class="update-screen-name">UPDATE Screen Name</button>\
                    </td>\
                    </tr>\
                    ');
                });
            }
        })
    }
});
