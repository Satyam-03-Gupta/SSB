import React, { useState } from "react";
import '../src/App.css';
import api from '../lib/axios.js';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            console.log('Submitting contact form:', formData);
            const response = await api.post('/api/contact', formData);
            console.log('Contact response:', response.data);
            
            alert(response.data.message);
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error('Contact form error:', error);
            alert(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <section id="contact-section">
            <div id="contact">
                <div className="background-cover-contact">
                    <div className="contactus">
                        <h2 className="main-title">
                            Contact <span className="color">Us</span>
                        </h2>
                        <h1 className="welcome-title">Get in touch</h1>
                        <h3 className="description-title color">
                            Hungry? Get your favorite hot and tasty biryani delivered today!
                        </h3>

                        <div className="contactbox">
                            <div className="contact-left">
                                <form onSubmit={handleSubmit} className="form-left">
                                    <label htmlFor="name">Your Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name!"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                    <label htmlFor="email">Your Email</label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                    <label htmlFor="phone">Your Phone</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your phone number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />

                                    <label htmlFor="subject">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="Enter subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />

                                    <label htmlFor="message">Message, Feedback</label>
                                    <textarea
                                        name="message"
                                        placeholder="Share your feedback or query here..."
                                        rows="7"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>

                                    <button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                    </button>
                                </form>
                            </div>
                            <div className="contact-right">
                                <div className="map_container">
                                    <div className="map-responsive">
                                        <iframe
                                            title="google-map"
                                            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3888.8991963132626!2d80.15752507507543!3d12.91419998739595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTLCsDU0JzUxLjEiTiA4MMKwMDknMzYuNCJF!5e0!3m2!1sen!2sin!4v1755458994624!5m2!1sen!2sin"
                                            width="600"
                                            height="450"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                    </div>
                                </div>

                                <div className="contact-right-details">
                                    <div className="right-container-phone">
                                        <div className="address1">
                                            <div className="contact-number">
                                                <span>
                                                    <h3 className="color">Contact Details</h3>
                                                    <i className="fas fa-mobile-alt">&nbsp;&nbsp;</i>
                                                    <a href="tel:+919962886575">+91 99625 25211</a>
                                                </span>
                                                <span>
                                                    <h3 className="color">Website Problem</h3>
                                                    <i className="fas fa-phone-alt">&nbsp;&nbsp;</i>
                                                    <a href="tel:+9199330378959">+91 93303 78959</a>
                                                </span>
                                            </div>
                                            <br />
                                            <span>
                                                <i className="fas fa-envelope">&nbsp;&nbsp;</i>
                                                <a href="mailto:supremestarbiriyani@gmail.com">
                                                    supremestarbiriyani@gmail.com
                                                </a>
                                            </span>
                                        </div>

                                        <div className="address2">
                                            <p>
                                                <i className="fas fa-map-marker-alt">&nbsp;</i>W576+M28,Second St,Kaushik Avenue,Madambakkam,Rajakilpakkam,Tamil Nadu 600073,India
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
