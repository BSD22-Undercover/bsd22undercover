function addEmoji() {
  let emojis = ["🥰", "😘", "😍", "😖", "😩", "😱"];
  const randomNumb = Math.floor(Math.random() * 5) + 1;
  return emojis[randomNumb];
}

module.exports = addEmoji;

//