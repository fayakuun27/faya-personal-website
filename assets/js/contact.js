function submitData(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phoneNumber = document.getElementById("phoneNumber").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // alert(`${name}\n${email}\n${phoneNumber}\n${subject}\n${message}`)

  if (name == "") {
    return alert("name harus diisi");
  } else if (email == "") {
    return alert("email harus diisi");
  } else if (phoneNumber == "") {
    return alert("phone number harus diisi");
  } else if (subject == "") {
    return alert("subject harus diisi");
  } else if (message == "") {
    return alert("message harus diisi");
  }

  // programtically link
  let a = document.createElement("a");

  a.href = `mailto:faya.it27@gmail.com?subject=${encodeURIComponent(
    subject
  )}&body=Hello, my name is ${encodeURIComponent(
    name
  )}.%0D%0A%0D%0APhone Number: ${encodeURIComponent(
    phoneNumber
  )}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;

  a.click();
}
