import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../services/theme.service';

@Component({
  selector: 'app-overall',
  standalone: false,
  templateUrl: './overall.component.html',
  styleUrl: './overall.component.scss'
})
export class OverallComponent {
  selectedDay = 'Monday';
  days = ['Monday', 'Wednesday', 'Friday', 'Saturday'];

  constructor(public themeService: ThemeService) {}

  get isDarkMode(): boolean {
    return this.themeService.isDark();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  stats = [
    { value: '1,200+', label: 'Active Members' },
    { value: '45+', label: 'Weekly Classes' },
    { value: '20+', label: 'Certified Coaches' },
    { value: '24/7', label: 'Club Access' }
  ];

  programs = [
    {
      number: '01',
      title: 'Strength & Hypertrophy',
      description: 'Olympic lifting platforms, calibrated plates, and progressive overload programming built for maximum muscle and power.',
      duration: '60 Mins • All Levels',
      highlights: ['Free Weights & Squat Racks', '1-on-1 Form Assessments']
    },
    {
      number: '02',
      title: 'HIIT & Metabolic Burn',
      description: 'High-intensity turf intervals, assault bikes, and sled sprints engineered to skyrocket endurance and torch fat.',
      duration: '45 Mins • High Intensity',
      highlights: ['Heart-Rate Zone Tracking', 'Small Group Energy']
    },
    {
      number: '03',
      title: 'Athletic Conditioning',
      description: 'Functional mobility, core stability, and explosive plyometrics to improve real-world movement and injury resilience.',
      duration: '50 Mins • Intermediate',
      highlights: ['Kettlebells & Battle Ropes', 'Mobility Recovery Flow']
    }
  ];

  schedules: Record<string, { time: string; class: string; coach: string; spots: string; level: string }[]> = {
    Monday: [
      { time: '06:30 AM', class: 'Morning Powerlifting', coach: 'Arjun Menon', spots: '4 spots left', level: 'All Levels' },
      { time: '09:00 AM', class: 'Sweat & Shred HIIT', coach: 'Priya Nair', spots: '6 spots left', level: 'Intermediate' },
      { time: '06:00 PM', class: 'Barbell Club', coach: 'Arjun Menon', spots: '2 spots left', level: 'Advanced' },
      { time: '07:30 PM', class: 'Core & Mobility Flow', coach: 'Vikram Rao', spots: '9 spots left', level: 'Beginner' }
    ],
    Wednesday: [
      { time: '06:30 AM', class: 'MetCon Turf Burn', coach: 'Priya Nair', spots: '5 spots left', level: 'All Levels' },
      { time: '10:00 AM', class: 'Upper Body Hypertrophy', coach: 'Vikram Rao', spots: '7 spots left', level: 'All Levels' },
      { time: '06:30 PM', class: 'Kettlebell & Conditioning', coach: 'Priya Nair', spots: '3 spots left', level: 'Intermediate' }
    ],
    Friday: [
      { time: '07:00 AM', class: 'Deadlift & Posterior Chain', coach: 'Arjun Menon', spots: '3 spots left', level: 'Intermediate' },
      { time: '05:30 PM', class: 'Friday Night Throwdown', coach: 'All Coaches', spots: '8 spots left', level: 'All Levels' }
    ],
    Saturday: [
      { time: '08:30 AM', class: 'Weekend Warrior Team WOD', coach: 'Priya & Arjun', spots: '5 spots left', level: 'All Levels' },
      { time: '11:00 AM', class: 'Deep Stretch & Recovery', coach: 'Vikram Rao', spots: '10 spots left', level: 'Beginner' }
    ]
  };

  plans = [
    {
      name: 'Starter',
      tagline: 'Essential gym floor access',
      price: '₹1,499',
      period: '/month',
      features: [
        'Unlimited Gym Floor & Cardio Zone',
        'Digital Locker & Shower Access',
        '1 Initial Body & Fitness Assessment',
        'Workout Tracking App Access'
      ],
      featured: false
    },
    {
      name: 'Pro Athlete',
      tagline: 'Most chosen for complete transformation',
      price: '₹2,499',
      period: '/month',
      features: [
        'Everything in Starter Plan',
        'Unlimited Group HIIT & Strength Classes',
        'Monthly InBody Composition Scan',
        '1 Guest Pass Every Month'
      ],
      featured: true
    },
    {
      name: 'Elite 1-on-1',
      tagline: 'Dedicated coaching & custom nutrition',
      price: '₹4,999',
      period: '/month',
      features: [
        'Everything in Pro Athlete',
        '4 Personal Training Sessions / Month',
        'Custom Macro & Meal Plan',
        'Priority Class & Sauna Booking'
      ],
      featured: false
    }
  ];

  trainers = [
    {
      initials: 'AM',
      name: 'Arjun Menon',
      role: 'Head Strength & Power Coach',
      cert: 'CSCS Certified • 8+ Yrs Experience',
      bio: 'Specializes in barbell mechanics, strength progression, and athletic hypertrophy.',
      image: 'assets/gymtrierphoto/photo1.png',
      specialties: ['Powerlifting', 'Hypertrophy', 'Form Analysis'],
      imageError: false
    },
    {
      initials: 'PN',
      name: 'Priya Nair',
      role: 'HIIT & Functional Conditioning',
      cert: 'CrossFit L2 • 6+ Yrs Experience',
      bio: 'Known for high-energy metabolic circuits that build stamina and mental grit.',
      image: 'assets/gymtrierphoto/photo2.png',
      specialties: ['Metabolic Conditioning', 'Kettlebells', 'Endurance'],
      imageError: false
    },
    {
      initials: 'VR',
      name: 'Vikram Rao',
      role: 'Mobility & Sports Nutrition',
      cert: 'ACE & Precision Nutrition • 7+ Yrs',
      bio: 'Helps busy professionals transform body composition with sustainable habits.',
      image: 'assets/gymtrierphoto/photo3.png',
      specialties: ['Injury Prevention', 'Nutrition Coaching', 'Recovery'],
      imageError: false
    }
  ];

  onTrainerImageError(trainer: any): void {
    trainer.imageError = true;
  }

  // Contact section data & logic
  contactForm = {
    name: '',
    email: '',
    phone: '',
    goal: 'Strength & Hypertrophy'
  };
  contactSubmitted = false;

  submitContactForm(): void {
    if (this.contactForm.name && (this.contactForm.phone || this.contactForm.email)) {
      this.contactSubmitted = true;
    }
  }

  branches = [
    {
      name: 'Indiranagar Flagship',
      address: '100 Feet Road, Indiranagar, Bengaluru, 560038',
      phone: '+91 98765 43210',
      hours: 'Mon - Sun: 5:00 AM - 11:00 PM',
      type: '24/7 Access • Olympic Zone'
    },
    {
      name: 'Koramangala Studio',
      address: '80 Feet Road, 4th Block, Koramangala, Bengaluru, 560034',
      phone: '+91 98765 43212',
      hours: 'Mon - Sun: 5:30 AM - 10:30 PM',
      type: 'HIIT Turf • Recovery Suite'
    },
    {
      name: 'HSR Club & Spa',
      address: '27th Main Road, Sector 1, HSR Layout, Bengaluru, 560102',
      phone: '+91 98765 43213',
      hours: 'Mon - Sun: 5:00 AM - 11:00 PM',
      type: 'Steam & Sauna • Strength Floor'
    }
  ];

  faqs = [
    {
      q: 'Can I try a session before buying a membership?',
      a: 'Absolutely! We offer a 1-day complimentary VIP pass that includes full gym floor access, locker access, and participation in any scheduled group class.',
      open: false
    },
    {
      q: 'What are the operating hours and peak times?',
      a: 'We are open from 5:00 AM to 11:00 PM seven days a week. Peak workout hours are 6:30 AM – 9:00 AM and 6:00 PM – 8:30 PM.',
      open: false
    },
    {
      q: 'Can I freeze or pause my membership if I travel?',
      a: 'Yes, all Pro Athlete and Elite members can pause their memberships for up to 60 days per year directly from the member portal at zero charge.',
      open: false
    },
    {
      q: 'Do you offer certified personal training & nutrition plans?',
      a: 'Yes, our CSCS and ACE certified coaches provide custom periodized training routines along with tailored macronutrient nutrition plans.',
      open: false
    }
  ];

  scrollToSection(sectionId: string, event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (sectionId === 'top') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Collapse mobile navigation menu if open
    const navbarCollapse = document.getElementById('overallNavbar');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  }
}
