import { useState, useEffect } from 'react';
import { playfair } from "./_app";
import Image from "next/image";
import { motion } from "framer-motion";

interface Service {
  id: string;
  title: string;
  description: string;
}

interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  service: string;
  frequency: string;
  extras: string[];
  startDate: string;
  timeWindow: string;
  instructions: string;
  promoCode: string;
  consent: boolean;
}

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  text: string;
}

const SparkleProWebsite = () => {
  // Services data
  const services: Service[] = [
    { id: 'home', title: 'Home Cleaning', description: 'Cleaning for houses and apartments.' },
    { id: 'office', title: 'Office Cleaning', description: 'Maintenance for offices and workspaces.' },
    { id: 'post', title: 'Post-Construction', description: 'Dust removal after construction.' },
    { id: 'event', title: 'Event Clean-Up', description: 'Before and after event cleaning.' },
    { id: 'deep', title: 'Deep Cleaning', description: 'Carpet, sofa, and upholstery cleaning.' },
  ];

  const frequencies = ['One-time', 'Weekly', 'Bi-weekly', 'Monthly'];
  
  const extras = [
    'Window cleaning',
    'Oven cleaning',
    'Fridge cleaning',
    'Upholstery steam clean'
  ];

  // State for wizard
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);

  
  // State for booking form
  const [bookingForm, setBookingForm] = useState<BookingFormData>({
    name: '',
    phone: '',
    email: '',
    address: '',
    service: '',
    frequency: '',
    extras: [],
    startDate: '',
    timeWindow: 'Morning (8AM-12PM)',
    instructions: '',
    promoCode: '',
    consent: false,
  });
  
  // State for testimonials
const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  // Load saved testimonials from localStorage, or use default ones
  useEffect(() => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("vixxTestimonials");
    if (saved) {
      setTestimonials(JSON.parse(saved));
    } else {
      setTestimonials([
        {
          id: 1,
          name: "Sarah Johnson",
          rating: 5,
          text: "Vixx Eco Cleaning transformed my home! Professional and eco-friendly service."
        },
        {
          id: 2,
          name: "Michael Chen",
          rating: 4,
          text: "Reliable office cleaning service. My workspace has never looked better."
        },
        {
          id: 3,
          name: "Emma Rodriguez",
          rating: 5,
          text: "Excellent post-construction cleanup. The team was efficient and detail-oriented."
        }
      ]);
    }
  }
}, []);

useEffect(() => {
  if (typeof window !== "undefined") {
    localStorage.setItem("vixxTestimonials", JSON.stringify(testimonials));
  }
}, [testimonials]);

  
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    rating: 5,
    text: ''
  });
  
  // State for contact form
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    message: ''
  });
  
  // State for modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  
  // Update booking form when wizard selections change
  useEffect(() => {
    setBookingForm(prev => ({
      ...prev,
      service: selectedService,
      frequency: selectedFrequency,
      extras: selectedExtras
    }));
  }, [selectedService, selectedFrequency, selectedExtras]);
  
  // Handle service selection
  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setCurrentStep(2);
  };
  
  // Handle frequency selection
  const handleFrequencySelect = (frequency: string) => {
    setSelectedFrequency(frequency);
    setCurrentStep(3);
  };
  
  // Toggle extras
  const toggleExtra = (extra: string) => {
    setSelectedExtras(prev => 
      prev.includes(extra) 
        ? prev.filter(e => e !== extra) 
        : [...prev, extra]
    );
  };
  
  // Handle booking form changes
  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setBookingForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setBookingForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle testimonial form changes
  const handleTestimonialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle contact form changes
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Submit booking
  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.email || !bookingForm.address || !bookingForm.startDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (!bookingForm.consent) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    // In a real app, you would send this to a backend
    console.log('Booking submitted:', bookingForm);
    setShowSuccessModal(true);
  };
  
  // Submit testimonial
 const submitTestimonial = (e: React.FormEvent) => {
  e.preventDefault();

  if (!newTestimonial.name || !newTestimonial.text) {
    alert("Please fill in all required fields");
    return;
  }

  // Add new testimonial to the beginning of the list
  let updated = [
    {
      id: Date.now(),
      name: newTestimonial.name,
      rating: newTestimonial.rating,
      text: newTestimonial.text,
    },
    ...testimonials,
  ];

  // Limit to 10 testimonials max
  if (updated.length > 10) {
    updated = updated.slice(0, 10);
  }

  setTestimonials(updated);
  setNewTestimonial({ name: "", rating: 5, text: "" });
  setShowTestimonialModal(true);

  // Close modal after 2 seconds
  setTimeout(() => {
    setShowTestimonialModal(false);
  }, 2000);
};
  
  // Submit contact form
  const submitContact = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      alert('Please fill in all required fields');
      return;
    }
    
    // In a real app, you would send this to a backend
    console.log('Contact submitted:', contactForm);
    alert('Thank you for your message! We will get back to you soon.');
    setContactForm({ name: '', phone: '', message: '' });
  };
  
  // Reset wizard
  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedService('');
    setSelectedFrequency('');
    setSelectedExtras([]);
  };
  
  // Scroll to booking form
  const scrollToBooking = () => {
    const element = document.getElementById('booking-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Sticky Header */}
<header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
  <div className="container mx-auto flex items-center justify-between px-6 py-4">
    {/* Logo / Brand */}
    <h1 className="text-2xl font-bold text-teal-700">
      Vixx <span className="text-gray-800">Eco Cleaning</span>
    </h1>
  </div>
</header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden pt-24">
  {/* Background video */}
  <video
  id="hero-video"
  src="/cleaning.mp4"
  autoPlay
  loop
  muted
  playsInline
  className="absolute inset-0 w-full h-full object-cover z-0"
/>

  {/* Dark overlay */}
<div className="absolute inset-0 bg-black/70 z-10"></div>
  {/* Hero content */}
  <div className="relative z-20 text-center px-4 max-w-4xl">
<h1 className={`${playfair.className} text-4xl md:text-6xl font-bold mb-6`}>
  Vixx <span className="text-green-400">Eco Cleaning</span> 
</h1>
    <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
      Professional cleaning services for homes and offices. Sparkling clean in no time!
    </p>
    <button 
      onClick={scrollToBooking}
      className="bg-white text-teal-700 font-bold py-3 px-8 rounded-full text-lg hover:bg-teal-100 transition duration-300"
    >
      Book a Cleaning
    </button>
  </div>

  {/* Fade at bottom */}
  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent z-20"></div>
</section>


      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">About Vixx Eco Cleaning</h2>
            <div className="w-20 h-1 bg-teal-600 mx-auto"></div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="rounded-xl w-full h-64 md:h-80 overflow-hidden">


<Image
  src="/logo.png"
  alt="Professional cleaning team"
  width={1920}
  height={1080}
  priority
  placeholder="blur"
  blurDataURL="/small-placeholder.jpg"
  className="rounded-3xl border-4 border-white shadow-lg"
/>
    alt="Vixx Eco Cleaning Logo"
    width={800}       // adjust width
    height={600}      // adjust height
    className="w-full h-full object-cover"
</div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Trusted Cleaning Experts</h3>
              <p className="text-gray-600 mb-4">
                Over the years, Vixx Eco Cleaning has been providing top-quality cleaning services to homes and offices. 
                Our team of trained professionals uses eco-friendly products and the latest cleaning techniques 
                to ensure your space is spotless and safe.
              </p>
              <p className="text-gray-600 mb-4">
                We understand that every space has unique needs, which is why we offer customizable cleaning packages 
                to suit your requirements. Our commitment to excellence has made us the preferred choice for 
                thousands of satisfied customers.
              </p>
              <div className="flex items-center mt-6">
                <div className="mr-4">
                  <div className="bg-teal-100 text-teal-800 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl">10+</div>
                  <p className="text-center mt-2 text-sm">Years Experience</p>
                </div>
                <div className="mr-4">
                  <div className="bg-teal-100 text-teal-800 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl">5000+</div>
                  <p className="text-center mt-2 text-sm">Happy Customers</p>
                </div>
                <div>
                  <div className="bg-teal-100 text-teal-800 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl">24/7</div>
                  <p className="text-center mt-2 text-sm">Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* Why Choose Us Section */}
<section className="py-16 bg-white" id="why-choose-us">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Vixx Eco Cleaning</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Discover why hundreds of homes and businesses trust Vixx Eco Cleaning to deliver unmatched quality, reliability, and eco-friendly care every single time.
      </p>
      <div className="w-20 h-1 bg-teal-600 mx-auto mt-4"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          icon: "🧼",
          title: "Eco-Friendly Products",
          text: "We use only biodegradable and non-toxic cleaning solutions — safe for your family, staff, and pets.",
        },
        {
          icon: "⏱️",
          title: "Punctual & Reliable",
          text: "Our professional team always shows up on time, fully equipped, and ready to make your space shine.",
        },
        {
          icon: "⭐",
          title: "Satisfaction Guarantee",
          text: "If it’s not spotless, it’s not done. We promise complete satisfaction with every cleaning job.",
        },
        {
          icon: "👩🏾‍🔧",
          title: "Trained Local Experts",
          text: "Our staff are background-checked, well-trained, and represent the trusted face of eco-cleaning in Nigeria.",
        },
        {
          icon: "📅",
          title: "Flexible Scheduling",
          text: "Book daily, weekly, or monthly — we fit seamlessly into your schedule without disrupting your routine.",
        },
        {
          icon: "💰",
          title: "Transparent Pricing",
          text: "No hidden fees. Get a free visit and an accurate quote before we begin — honesty is part of our brand.",
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.15 }}
          whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0, 128, 128, 0.2)" }}
          className="bg-gray-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all"
        >
          <div className="text-5xl mb-4">{item.icon}</div>
          <h3 className="text-xl font-semibold text-teal-700 mb-2">{item.title}</h3>
          <p className="text-gray-600">{item.text}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

{/* Services Wizard Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">Choose from our range of professional cleaning services tailored to your needs.
Once you complete your booking, our team will schedule a free on-site evaluation to understand your space and provide the most accurate, transparent pricing, ensuring you get exceptional value and spotless results.</p>
            <div className="w-20 h-1 bg-teal-600 mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between mb-8">
              <div className={`text-center ${currentStep === 1 ? 'text-teal-600' : 'text-gray-400'}`}>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">1</div>
                <p className="font-medium">Choose Service</p>
              </div>
              <div className={`text-center ${currentStep === 2 ? 'text-teal-600' : 'text-gray-400'}`}>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">2</div>
                <p className="font-medium">Frequency</p>
              </div>
              <div className={`text-center ${currentStep === 3 ? 'text-teal-600' : 'text-gray-400'}`}>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">3</div>
                <p className="font-medium">Add Extras</p>
              </div>
            </div>
            
            {currentStep === 1 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Select a Service</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div 
                      key={service.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${selectedService === service.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'}`}
                      onClick={() => handleServiceSelect(service.id)}
                    >
                      <h4 className="font-bold text-lg text-gray-800 mb-2">{service.title}</h4>
                      <p className="text-gray-600 text-sm">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Select Frequency</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {frequencies.map((freq) => (
                    <div 
                      key={freq}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${selectedFrequency === freq ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'}`}
                      onClick={() => handleFrequencySelect(freq)}
                    >
                      <h4 className="font-bold text-lg text-gray-800">{freq}</h4>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-6">
                  <button 
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Add Extra Services(optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {extras.map((extra) => (
                    <div 
                      key={extra}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 flex items-center ${selectedExtras.includes(extra) ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-teal-300'}`}
                      onClick={() => toggleExtra(extra)}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedExtras.includes(extra)}
                        onChange={() => toggleExtra(extra)}
                        className="mr-3 h-5 w-5 text-teal-600 rounded focus:ring-teal-500"
                      />
                      <span className="font-medium text-gray-800">{extra}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-6">
                  <button 
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Back
                  </button>
                  <button 
                    onClick={scrollToBooking}
                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            )}
            
            {currentStep === 3 && (
              <div className="mt-8 p-4 bg-green-100 rounded-lg border border-green-300 shadow">
  <h4 className="font-bold text-lg text-green-800 mb-2">Your Selection:</h4>
  <p className="text-green-800">
    <span className="font-medium">Service:</span> {services.find(s => s.id === selectedService)?.title || 'Not selected'}
  </p>
  <p className="text-green-800">
    <span className="font-medium">Frequency:</span> {selectedFrequency || 'Not selected'}
  </p>
  <p className="text-green-800">
    <span className="font-medium">Extras:</span> {selectedExtras.length > 0 ? selectedExtras.join(', ') : 'None'}
  </p>
</div> 
            )}
          </div>
        </div>
      </section>

{/* Pricing Section with Animation */}
<section className="py-16 bg-gray-50" id="pricing">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Pricing Plans</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        We believe in fair, transparent pricing — tailored to the size of your space and the level of care required.
        Every quote includes eco-friendly cleaning products and our trusted professional service.
      </p>
      <div className="w-20 h-1 bg-teal-600 mx-auto mt-4"></div>
    </div>

    {/* Animated Pricing Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          title: "Home Cleaning",
          desc: "For apartments and houses. Includes dusting, mopping, kitchen and bathroom cleaning.",
          pricing: [
            "• Standard clean: ₦25,000 – ₦35,000",
            "• Deep clean: ₦70,000 – ₦90,000",
            "• Upholstery / Carpet add-on: from ₦5,000",
          ],
          button: "Book Home Cleaning",
        },
        {
          title: "Office & School Cleaning",
          desc: "Keep your workspace and classrooms spotless and germ-free with flexible daily or weekly schedules.",
          pricing: [
            "• Weekly plan: ₦100,000 – ₦150,000 / month",
            "• One-off service: ₦40,000 – ₦60,000",
            "• Floor polishing & disinfection: from ₦15,000",
          ],
          button: "Book Office/School Cleaning",
        },
        {
          title: "Outdoor & Facility Cleaning",
          desc: "Cleaning for compound areas, driveways, walkways, and commercial outdoor environments.",
          pricing: [
            "• Basic outdoor clean: ₦30,000 – ₦50,000",
            "• Full grounds service: from ₦80,000",
            "• Road or car park cleaning: custom quote",
          ],
          button: "Get Custom Quote",
        },
      ].map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-teal-100 p-8 hover:shadow-xl transition"
        >
          <h3 className="text-2xl font-bold text-teal-700 mb-4">{card.title}</h3>
          <p className="text-gray-600 mb-6">{card.desc}</p>
          <ul className="text-gray-700 space-y-2 mb-6">
            {card.pricing.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
          <button
            onClick={() =>
              document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition"
          >
            {card.button}
          </button>
        </motion.div>
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="text-center mt-12"
    >
      <p className="text-gray-600 mb-4">
        Need something special? We also offer post-construction, event clean-up, fumigation, and janitorial contracts.
      </p>
      <button
        onClick={() => document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" })}
        className="bg-teal-700 text-white px-8 py-3 rounded-full font-bold hover:bg-teal-800 transition"
      >
        Request a Free Evaluation
      </button>
    </motion.div>
  </div>
</section>



      {/* Booking Form Section */}
      <section id="booking-form" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Book Your Cleaning</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">Fill out the form below to schedule your cleaning service.</p>
            <div className="w-20 h-1 bg-teal-600 mx-auto"></div>
          </div>
          
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
            <form 
  onSubmit={async (e) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const data = new FormData(form);

    // Send to Formspree
    const res = await fetch("https://formspree.io/f/xpwyoare", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      setShowBookingModal(true);
      form.reset();

      // Auto close + refresh after 3 seconds
      setTimeout(() => {
        setShowBookingModal(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.location.reload();
      }, 3000);
    } else {
      alert("❌ Something went wrong, please try again.");
    }
  }}
  className="space-y-4"
>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={bookingForm.name}
                    onChange={handleBookingChange}
                    className="w-full px-4 py-2 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={bookingForm.phone}
                    onChange={handleBookingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={bookingForm.email}
                    onChange={handleBookingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="address">Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={bookingForm.address}
                    onChange={handleBookingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Service</label>
<select
  value={selectedService || ""}
  onChange={(e) => setSelectedService(e.target.value)}
  className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-teal-700"
>
  <option value="">Select a service</option>
  {services.map((s) => (
    <option key={s.id} value={s.id}>
      {s.title}
    </option>
  ))}
</select>
                </div>
                <div>
                  <label className="block mb-2 font-medium">Frequency</label>
<select
  value={selectedFrequency || ""}
  onChange={(e) => setSelectedFrequency(e.target.value)}
  className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-teal-700"
>
  <option value="">Select frequency</option>
  <option value="One-time">One-time</option>
  <option value="Weekly">Weekly</option>
  <option value="Bi-weekly">Bi-weekly</option>
  <option value="Monthly">Monthly</option>
</select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="startDate">Preferred Date *</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={bookingForm.startDate}
                    onChange={handleBookingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="timeWindow">Time Window</label>
                  <select
                    id="timeWindow"
                    name="timeWindow"
                    value={bookingForm.timeWindow}
                    onChange={handleBookingChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                  >
                    <option value="Morning (8AM-12PM)">Morning (8AM-12PM)</option>
                    <option value="Afternoon (12PM-4PM)">Afternoon (12PM-4PM)</option>
                    <option value="Evening (4PM-8PM)">Evening (4PM-8PM)</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="extras">Selected Extras</label>
                <div className="flex flex-wrap gap-2">
                  {bookingForm.extras.length > 0 ? (
                    bookingForm.extras.map((extra, index) => (
                      <span key={index} className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                        {extra}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No extras selected</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="instructions">Additional Instructions</label>
                <textarea
                  id="instructions"
                  name="instructions"
                  value={bookingForm.instructions}
                  onChange={handleBookingChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                ></textarea>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="promoCode">Promo Code</label>
                <input
                  type="text"
                  id="promoCode"
                  name="promoCode"
                  value={bookingForm.promoCode}
                  onChange={handleBookingChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                />
              </div>
              
              <div className="mb-6 flex items-start">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={bookingForm.consent}
                  onChange={handleBookingChange}
                  className="mt-1 mr-3 h-5 w-5 text-teal-600 rounded focus:ring-teal-500"
                  required
                />
                <label htmlFor="consent" className="text-gray-700">
                  I agree to the terms and conditions and consent to receive communications about my booking.
                </label>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition duration-300"
              >
                Confirm Booking
              </button>
            </form>
            {/* ✅ Animated Booking Success Modal */}
{showBookingModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 animate-fadeIn">
    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center transform scale-95 animate-zoomIn">
      <h3 className="text-xl font-bold text-teal-600 mb-2">Booking Confirmed!</h3>
      <p className="text-gray-700">
        ✅ Thank you for booking with Vixx Eco Cleaning. We’ll contact you soon to confirm details.
      </p>
    </div>
  </div>
)}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testi" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Customer Testimonials</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">See what our customers have to say about our services.</p>
            <div className="w-20 h-1 bg-teal-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {testimonials.map((t, index) => {
  const count = testimonials.length;
  const scale = Math.max(0.85, 1 - count * 0.03);
  const fontSize = `${Math.max(0.8, 1 - count * 0.02)}rem`;
  const padding = `${Math.max(1, 1.5 - count * 0.05)}rem`;
  const gap = `${Math.max(0.75, 1.5 - count * 0.1)}rem`;

  return (
    <motion.div
      key={t.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15, // staggered animation
        ease: "easeOut",
      }}
      className="bg-white rounded-xl shadow-md border border-teal-100 hover:shadow-lg transition-all duration-700 ease-in-out"
      style={{
        transform: `scale(${scale})`,
        fontSize,
        padding,
        margin: gap,
      }}
    >
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <div className="bg-teal-100 rounded-xl w-16 h-16 flex items-center justify-center text-teal-700 font-bold text-xl">
            {t.name ? t.name.charAt(0) : "?"}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg text-gray-800">{t.name}</h4>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < t.rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600 italic leading-snug">"{t.text}"</p>
    </motion.div>
  );
})}

          </div>
          
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Share Your Experience</h3>
            <form onSubmit={submitTestimonial}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="testimonialName">Your Name *</label>
                  <input
                    type="text"
                    id="testimonialName"
                    name="name"
                    value={newTestimonial.name}
                    onChange={handleTestimonialChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="rating">Rating *</label>
                  <select
                    id="rating"
                    name="rating"
                    value={newTestimonial.rating}
                    onChange={handleTestimonialChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                  >
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="testimonialText">Your Review *</label>
                <textarea
                  id="testimonialText"
                  name="text"
                  value={newTestimonial.text}
                  onChange={handleTestimonialChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                  required
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition duration-300"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">Have questions? Get in touch with us.</p>
            <div className="w-20 h-1 bg-teal-600 mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Get in Touch</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-teal-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span className="text-gray-700">(234) 905 369 3628</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-teal-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-gray-700">vixxtechteam@gmail.com</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-teal-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="text-gray-700">1 Silver Street, Off Bamisile Street, Egbeda Lagos. Nigeria</span>
                </li>
              </ul>
              
              <div className="mt-8">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Business Hours</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-700">Monday - Friday</span>
                    <span className="text-gray-700">8:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between border-b border-gray-200 pb-2">
                    <span className="text-gray-700">Saturday</span>
                    <span className="text-gray-700">10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="flex justify-between pb-2">
                    <span className="text-gray-700">Sunday</span>
                    <span className="text-gray-700">Closed</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Send us a Message</h3>
              <form 
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = new FormData(form);

        const res = await fetch("https://formspree.io/f/xeorpqqz", {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });

       if (res.ok) {
          setShowContactModal(true);
          form.reset();

          // ✅ Auto close + refresh page after 3 seconds
          setTimeout(() => {
            setShowContactModal(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            window.location.reload();
          }, 3000);
        } else {
          alert("❌ Oops, something went wrong. Please try again.");
        }
      }}
      className="space-y-4"
    >

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="contactName">Full Name *</label>
                  <input
                    type="text"
                    id="contactName"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="contactPhone">Phone Number *</label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2" htmlFor="contactMessage">Message *</label>
                  <textarea
                    id="contactMessage"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-teal-700"
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 transition duration-300"
                >
                  Send Message
                </button>
              </form>
               {/* ✅ Success Modal */}
    {showContactModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full text-center">
          <h3 className="text-xl font-bold text-teal-600 mb-2">Message Sent!</h3>
          <p className="text-gray-700">
            ✅ Thank you for contacting us. We’ll get back to you soon.
          </p>
        </div>
      </div>
    )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Vixx Eco Cleaning</h3>
              <p className="text-gray-400 mb-4">Professional cleaning services for homes and offices. Sparkling clean in no time!</p>
              <div className="flex space-x-4">
                <a href="#https://www.facebook.com/share/1JE729xG2H/?mibextid=wwXIfr" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#https://www.instagram.com/vixx_eco_cleaning?igsh=ejZ4MXR0NGpyMHQx&utm_source=qr" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Services</h4>
              <ul className="space-y-2">
                <li><a href="#booking-form" className="text-gray-400 hover:text-white">Home Cleaning</a></li>
                <li><a href="#booking-form" className="text-gray-400 hover:text-white">Office Cleaning</a></li>
                <li><a href="#booking-form" className="text-gray-400 hover:text-white">Post-Construction</a></li>
                <li><a href="#booking-form" className="text-gray-400 hover:text-white">Event Clean-Up</a></li>
                <li><a href="#booking-form" className="text-gray-400 hover:text-white">Deep Cleaning</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#booking-form" className="text-gray-400 hover:text-white">Booking Process</a></li>
                <li><a href="#testi" className="text-gray-400 hover:text-white">Testimonials</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li> 
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Info</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-teal-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span className="text-gray-400">1 Silver Street, Off Bamisile Street, Egbeda Lagos. Nigeria</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-teal-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span className="text-gray-400">(234) 905 369 3628</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-teal-400 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span className="text-gray-400">vixxtechteam@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Vixx Eco Cleaning. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-4">Booking Confirmed!</h3>
              <p className="mt-2 text-gray-600">
                Thank you for your booking. We've sent a confirmation to your email.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Success Modal */}
      {showTestimonialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-4">Thank You!</h3>
              <p className="mt-2 text-gray-600">
                Your testimonial has been submitted successfully.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SparkleProWebsite;
