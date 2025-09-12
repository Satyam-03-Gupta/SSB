import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  try {
    console.log('Contact form submission:', req.body);
    const { name, email, phone, subject, message } = req.body;
    
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const contact = new Contact({ name, email, phone, subject, message });
    await contact.save();
    console.log('Contact saved:', contact._id);

    res.status(201).json({ 
      message: "Thank you for contacting us! We'll get back to you soon.",
      contactId: contact._id 
    });
  } catch (error) {
    console.error('Contact creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};