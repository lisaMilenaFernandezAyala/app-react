import React, { Component } from "react";
import Cookies from 'universal-cookie';
 
const cookies = new Cookies();

class Form extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    Array.from(event.target.childNodes).forEach(item => {
      if(item.attributes.type && item.name) {
        if(item.value)
          cookies.set(item.name, item.value, { path: '/' });
        else
          cookies.remove(item.name);
      } else if(item.tagName.toLowerCase() === 'div')
        Array.from(item.childNodes).forEach(subItem => {
          const item = subItem.childNodes[0];
          if(item.checked)
            cookies.set(item.name, item.value, { path: '/' });
        });
    })
    event.preventDefault();
  }

  render() {
    console.log(cookies)
    let values = cookies.getAll();
    return (
      <div>
        <h2>Form</h2>
 
        <form className="defaults" onSubmit={this.handleSubmit}>
          <label>Alias:</label>
          <input type="text" name="alias" defaultValue={values.alias} placeholder="Alias" />

          <label>Name:</label>
          <input type="text" name="name" defaultValue={values.name} placeholder="Name" />

          <label>Surname:</label>
          <input type="text" name="surname" defaultValue={values.surname} placeholder="Surname" />

          <label>Birthday:</label>
          <input type="date" name="birthday" defaultValue={values.birthday} placeholder="Birthday" />

          <label>Email:</label>
          <input type="text" name="email" defaultValue={values.email} placeholder="Email" />

          <label>Gender:</label>
          <div>
            <label><input type="radio" name="gender" value="male" defaultChecked={values.gender==="male"} /> Male</label>
            <label><input type="radio" name="gender" value="female" defaultChecked={values.gender==="female"} /> Female</label>
            <label><input type="radio" name="gender" value="other" defaultChecked={values.gender==="other"} /> Other</label>
          </div>

          <label>Country:</label>
          <input type="text" name="country" value={values.country} disabled />
          
          <input type="submit" value="Submit" className="m-t-30"/>
        </form>
      </div>
    );
  }
}
 
export default Form;