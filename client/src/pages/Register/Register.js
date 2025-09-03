import React, { useContext, useEffect, useState } from 'react'
import Card from "react-bootstrap/Card"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';
import Spiner from "../../components/Spiner/Spiner"
import { registerfunc } from "../../services/Apis"
import { ToastContainer, toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import 'react-toastify/dist/ReactToastify.css';
import "./register.css"
import { addData } from '../../components/context/ContextProvider';

const Register = () => {

  const [inputdata, setInputData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    gender: "",
    location: ""
  });

  const [status, setStatus] = useState("Active");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [showspin, setShowSpin] = useState(true);

  const navigate = useNavigate();
  const { setUseradd } = useContext(addData);

  // status options
  const options = [
    { value: 'Active', label: 'Active' },
    { value: 'InActive', label: 'InActive' },
  ];

  // set input values
  const setInputValue = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputdata, [name]: value })
  }

  // set status value
  const setStatusValue = (e) => {
    setStatus(e.value)
  }

  // set profile image
  const setProfile = (e) => {
    setImage(e.target.files[0])
  }

  // submit user data
  const submitUserData = async (e) => {
    e.preventDefault();

    const { fname, lname, email, mobile, gender, location } = inputdata;

    if (fname === "") {
      toast.error("First name is Required !")
    } else if (lname === "") {
      toast.error("Last name is Required !")
    } else if (email === "") {
      toast.error("Email is Required !")
    } else if (!email.includes("@")) {
      toast.error("Enter Valid Email !")
    } else if (mobile === "") {
      toast.error("Mobile is Required !")
    } else if (mobile.length !== 10) {
      toast.error("Enter Valid Mobile Number!")
    } else if (gender === "") {
      toast.error("Gender is Required !")
    } else if (status === "") {
      toast.error("Status is Required !")
    } else if (image === "") {
      toast.error("Profile is Required !")
    } else if (location === "") {
      toast.error("Location is Required !")
    } else {
      const data = new FormData();
      data.append("fname", fname)
      data.append("lname", lname)
      data.append("email", email)
      data.append("mobile", mobile)
      data.append("gender", gender)
      data.append("status", status)
      data.append("user_profile", image)
      data.append("location", location)

      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }

      const response = await registerfunc(data, config);

      if (response && (response.status === 200 || response.status === 201)) {
        toast.success(response.data.message || "User Registered Successfully");

        setInputData({
          fname: "",
          lname: "",
          email: "",
          mobile: "",
          gender: "",
          location: ""
        });
        setStatus("Active"); // reset to default
        setImage("");
        setUseradd(response.data);
        navigate("/");
      } else {
        toast.error(response?.data?.message || "Something went wrong!");
      }
    }
  }

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl); // cleanup
    }

    const timer = setTimeout(() => {
      setShowSpin(false)
    }, 1200);

    return () => clearTimeout(timer);
  }, [image])

  return (
    <>
      {
        showspin ? <Spiner /> : <div className="container">
          <h2 className='text-center mt-1'>Register Your Details</h2>
          <Card className='shadow mt-3 p-3'>
            <div className="profile_div text-center">
              <img src={preview ? preview : "/man.png"} alt="img" className='user-profile' />
            </div>

            <Form>
              <Row>
                <Form.Group className="mb-3 col-lg-6" controlId="formFname">
                  <Form.Label>First name</Form.Label>
                  <Form.Control type="text" name='fname' value={inputdata.fname} onChange={setInputValue} placeholder='Enter First Name' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formLname">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name='lname' value={inputdata.lname} onChange={setInputValue} placeholder='Enter Last Name' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" name='email' value={inputdata.email} onChange={setInputValue} placeholder='Enter Email' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formMobile">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control type="text" name='mobile' value={inputdata.mobile} onChange={setInputValue} placeholder='Enter Mobile' />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formGender">
                  <Form.Label>Select Your Gender</Form.Label>
                  <Form.Check
                    type="radio"
                    label="Male"
                    name="gender"
                    value="Male"
                    checked={inputdata.gender === "Male"}
                    onChange={setInputValue}
                  />
                  <Form.Check
                    type="radio"
                    label="Female"
                    name="gender"
                    value="Female"
                    checked={inputdata.gender === "Female"}
                    onChange={setInputValue}
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formStatus">
                  <Form.Label>Select Your Status</Form.Label>
                  <Select options={options} value={options.find(opt => opt.value === status)} onChange={setStatusValue} />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formProfile">
                  <Form.Label>Select Your Profile</Form.Label>
                  <Form.Control type="file" name='user_profile' onChange={setProfile} />
                </Form.Group>
                <Form.Group className="mb-3 col-lg-6" controlId="formLocation">
                  <Form.Label>Enter Your Location</Form.Label>
                  <Form.Control type="text" name='location' value={inputdata.location} onChange={setInputValue} placeholder='Enter Your Location' />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={submitUserData}>
                  Submit
                </Button>
              </Row>
            </Form>
          </Card>
          <ToastContainer position="top-center" />
        </div>
      }
    </>
  )
}

export default Register
