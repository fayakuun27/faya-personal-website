class Testimonial {
  image = "";
  content = "";
  author = "";

  constructor(image, content, author) {
    this.image = image;
    this.content = content;
    this.author = author;
  }

  html() {
    throw new Error(
      "You should use one of 'AuthorTestimonial' or 'CompanyTestimonial'"
    );
  }
}

class AuthorTestimonial extends Testimonial {
  html() {
    return `<div class="col">
      <div class="card">
        <img src="${this.image}" class="card-img-top object-fit-cover" alt="..." />
        <div class="card-body">
          <p class="card-text fst-italic">
            "${this.content}"
          </p>
          <p class="text-end fw-bold">-${this.author}</p>
          <p class="text-end fw-bold">
            1 <i class="fa-solid fa-star"></i>
          </p>
        </div>
      </div>
    </div>`;
  }
}

class CompanyTestimonial extends Testimonial {
  html() {
    return `<div class="col">
      <div class="card">
        <img src="${this.image}" class="card-img-top object-fit-cover" alt="..." />
        <div class="card-body">
          <p class="card-text fst-italic">
            "${this.content}"
          </p>
          <p class="text-end fw-bold">-${this.author} Company</p>
          <p class="text-end fw-bold">
            1 <i class="fa-solid fa-star"></i>
          </p>
        </div>
      </div>
    </div>`;
  }
}

const testimonial1 = new AuthorTestimonial(
  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=600",
  "Mantap sekali jasanya!",
  "Jimih Setiawan"
);

const testimonial2 = new AuthorTestimonial(
  "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600",
  "Keren kamu bro!",
  "Adika Wahyu Sulaiman"
);

const testimonial3 = new CompanyTestimonial(
  "https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=600",
  "Apasih bang!",
  "Almas Fadhillah"
);

const testimonials = [testimonial1, testimonial2, testimonial3];

let testimonialHTML = ``;

for (let index = 0; index < testimonials.length; index++) {
  testimonialHTML += testimonials[index].html();
}
document.getElementById("testimonials").innerHTML = "";
document.getElementById("testimonials").innerHTML = testimonialHTML;
