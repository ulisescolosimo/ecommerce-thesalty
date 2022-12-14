import React from 'react'
import { useRef } from "react";
import { SignUpGoogle } from './SignUpGoogle';
import ReCAPTCHA from "react-google-recaptcha";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useGetNewUserMutation } from '../features/usersAPI';
import { toast } from 'react-toastify';
import { Link as LinkRouter } from 'react-router-dom'
import '../styles/SignUp.css'
import { useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const SignUp = () => {
  const form = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newUser, resultSignUp] = useGetNewUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form.current);
    const formUser = {
      name: formData.get("name"),
      email: formData.get("email"),
      photo: picture,
      password: formData.get("password"),
      from: "form",
      role: "user"
    };

    try {
      await newUser(formUser)
        .then(success => {
          if (captcha.current.getValue()) {
            if (success.error) {
              toast.error(success.error.data.message);
              console.log(success.error);
            } else {
              toast.success(success.data.message);
              form.current.reset();
              navigate("/signin")
            }
          } else {
            toast.error('Confirm captcha before sign up');
          }
        })
    }
    catch (error) {
      console.error(error);
    }
  }

  const captcha = useRef(null)

  function onChange() {
    if (captcha.current.getValue()) {
      console.log(captcha.current.getValue())
    }
  }

  const firebaseConfig = {
    apiKey: "AIzaSyAb7ssdzkn4H4KILSJT8AkOMx0RgnnkUTo",
    authDomain: "thesalty.firebaseapp.com",
    projectId: "thesalty",
    storageBucket: "thesalty.appspot.com",
    messagingSenderId: "350368373390",
    appId: "1:350368373390:web:0c2baf1a2a37626e37c7df",
    measurementId: "G-HK546M1S0F"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const [value, setValue] = useState(0)
  const [picture, setPicture] = useState(null)

  const handleUpload = (event) => {
    const file = event.target.files[0]
    const storageRef = ref(getStorage(), 'images/' + file.name)
    const task = uploadBytesResumable(storageRef, file, { contentType: 'image/png' })
    task.on('state_changed',
      (snapshot) => setValue(100 * (snapshot.bytesTransferred / snapshot.totalBytes)),
      (error) => console.log(error.message),
      async () => setPicture(await getDownloadURL(task.snapshot.ref))
    )
  }

  return (

    <div className='containerSignUp'>
      <video className='videoSignUp' src="./assets/video.mp4" autoPlay loop playsInline muted />
      <form ref={form} className="formSignUp">
        <div className="container1 card shadow-2xl ">
          <div className="card-body card-signup">
            <div className="form-control form-signup-input">
              <label className="label">
                <span className="label-text">Name and Lastname</span>
              </label>
              <input type="text" name="name" placeholder="Enter name..." className="input input-bordered" />
            </div>
            <div className="form-control form-signup-input">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="text" name="email" placeholder="Enter email..." className="input input-bordered" />
            </div>
            <div className="form-control form-signup-input flex-wrap">
              <label className="label">
                <span className="label-text">Photo</span>
              </label>
              <input className='w-full' type='file' onChange={handleUpload} />
              <input type='hidden' name='photo' id={picture} />
              <progress className='m-2' value={value} max='100' name='file' />
            </div>
            <div className="form-control form-signup-input">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="password" placeholder="Enter password..." name="password" className="input input-bordered" />
            </div>
            <div className="flex justify-center items-center">
              <ReCAPTCHA
                sitekey="6LfLI1UiAAAAAEG2Baygi7bZD1cAggQcuDvK3W0N"
                onChange={onChange}
                theme={'dark'}
                ref={captcha}
              />
            </div>
            <div className="btnform form-control">
              <button className="buttonform btn" onClick={handleSubmit}>Sign up</button>
            </div>
            <p className='or'>or</p>
            <div className="flex justify-center align-items-center">
              <SignUpGoogle />
            </div>

          </div>
        </div>
        <div className="textNew text-center lg:text-left">
          <p className="p-4">You have an account? Please <LinkRouter className='link-new' to="/signin">login!</LinkRouter>  </p>
        </div>
      </form>

    </div>
  )
}

export default SignUp