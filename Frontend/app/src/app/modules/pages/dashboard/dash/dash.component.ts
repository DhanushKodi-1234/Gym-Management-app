import { Component } from '@angular/core';

@Component({
  selector: 'app-dash',
  standalone: false,
  templateUrl: './dash.component.html',
  styleUrl: './dash.component.scss'
})
export class DashComponent {
  athleteName = 'Dhanush';
  membershipTier = 'Pro Elite Athlete';
  activeClub = 'Indiranagar Flagship Studio';
  memberId = 'GG-842';

  // Live Performance Metrics
  dailyCaloriesBurned = 785;
  dailyCalorieGoal = 950;
  weeklyStreakDays = 5;
  totalWeightLiftedKg = 24500;
  currentWeightKg = 76.0;
  targetWeightKg = 72.0;
  heightCm = 178;

  get estimatedBmi(): string {
    const meters = this.heightCm / 100;
    return (this.currentWeightKg / (meters * meters)).toFixed(1);
  }

  get caloriePercent(): number {
    return Math.min(100, Math.round((this.dailyCaloriesBurned / this.dailyCalorieGoal) * 100));
  }

  // Today's Scheduled Workout
  todaysWorkout = {
    title: 'Strength & Hypertrophy: Lower Body Dominance',
    duration: '60 mins',
    coach: 'Coach Marcus Vance',
    exercises: [
      { name: 'Barbell Back Squats', sets: '4 sets × 8 reps', weight: '95 kg', completed: true },
      { name: 'Romanian Deadlifts (RDL)', sets: '3 sets × 10 reps', weight: '80 kg', completed: true },
      { name: 'Walking Dumbbell Lunges', sets: '3 sets × 12 reps', weight: '22 kg each', completed: false },
      { name: 'Standing Calf Raises', sets: '4 sets × 15 reps', weight: '20 kg plate', completed: false }
    ]
  };

  // Upcoming Booked Group Classes
  bookedClasses = [
    {
      title: 'Olympic Lifting Mastery',
      time: 'Today • 06:30 PM - 07:30 PM',
      trainer: 'Coach Marcus Vance',
      zone: 'Indiranagar Turf Zone A',
      status: 'Confirmed'
    },
    {
      title: 'Metabolic HIIT Burn',
      time: 'Tomorrow • 07:00 AM - 07:45 AM',
      trainer: 'Coach Elena Rostova',
      zone: 'Studio 2 (High Energy)',
      status: 'Confirmed'
    },
    {
      title: 'Athletic Conditioning & Mobility',
      time: 'Saturday • 08:30 AM - 09:20 AM',
      trainer: 'Coach Marcus Vance',
      zone: 'Recovery & Flexibility Lab',
      status: 'Booked'
    }
  ];

  // Daily Nutrition Breakdown
  nutrition = {
    protein: { current: 162, target: 180, unit: 'g' },
    carbs: { current: 210, target: 240, unit: 'g' },
    fats: { current: 54, target: 65, unit: 'g' },
    water: { current: 3.2, target: 4.0, unit: 'L' }
  };

  quickNotice = '';

  logTrainingSession(): void {
    this.dailyCaloriesBurned = Math.min(this.dailyCalorieGoal, this.dailyCaloriesBurned + 115);
    this.quickNotice = '🔥 Training set logged! +115 kcal recorded toward daily goal.';
    setTimeout(() => this.quickNotice = '', 4500);
  }

  toggleExercise(ex: any): void {
    ex.completed = !ex.completed;
  }
}
