document.addEventListener('DOMContentLoaded', () => {
  const cardElement = document.getElementById('card');
  const messageElement = document.getElementById('message');
  const titleElement = document.getElementById('title');
  const shareButton = document.getElementById('share-button');
  const infoButton = document.getElementById('info-button');

  // generate a random token and store it in local storage
  const generateToken = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  // add click event listener to share button
  shareButton.addEventListener('click', async () => {
    // generate a new token and create a share link with the message, title, and token in the query parameters
    const token = generateToken();
    const shareUrl = `${window.location.origin}${window.location.pathname}?message=${encodeURIComponent(
      messageElement.innerText
    )}&title=${encodeURIComponent(titleElement.innerText)}&token=${encodeURIComponent(token)}`;

    // Make a POST request to the API endpoint to shorten the URL
    fetch('https://bitelink.000webhostapp.com/api.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ longUrl: shareUrl }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          const shortUrl = data.shortUrl;
          // auto open WhatsApp with the generated short link
          const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
            `Click 👉 ${shortUrl}`
          )}`;
          window.open(whatsappUrl, '_blank');
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        alert('Error: ' + error.message);
      });
  });

  // add click event listener to info button
  infoButton.addEventListener('click', () => {
    alert(
      'Introducing the latest tool by Shashi: the One-Time Message Sender. Iss tool ki madad se aap kisi ko message bhej sakte ho, jo sirf ek baar dikhayi dega, phir hamesha ke liye delete ho jaayega. Yeh tool sensitive information aur private conversations ke liye accha option hai.'
    );
  });

  // check if a message, title, and token are present in the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const message = urlParams.get('message');
  const title = urlParams.get('title');
  const token = urlParams.get('token');

  if (message && title && token) {
    // if a message, title, and token are present, check if the token is valid
    const viewedToken = localStorage.getItem(token);

    if (!viewedToken) {
      // if the token is not found in local storage, display the message and title
      messageElement.innerText = message;
      titleElement.innerText = title;

      // store the token in local storage to mark it as viewed
      localStorage.setItem(token, 'viewed');
    } else {
      // if the token is found in local storage, show an error message
      messageElement.innerText = 'This message has already been viewed. Tap to edit and send.';
      titleElement.innerText = 'Sorry';
    }
  } else {
    // if no message, title, or token are present, show the default message and title
    messageElement.innerText = 'Enter your message here';
    titleElement.innerText = 'Enter Your Name';
  }
});