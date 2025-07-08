import { jwtDecode } from 'jwt-decode';

// API functions for planner functionality

// Helper to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

// Helper function to get valid token
const getValidToken = () => {
  const token = localStorage.getItem('token');
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Token expired');
  }
  return token;
};

export const getPlannerStats = async () => {
  const token = getValidToken();
  if (!token) throw new Error('No token found');

  try {
    // Fetch todos and timetable data
    const [todosRes, timetableRes] = await Promise.all([
      fetch('http://localhost:5000/api/todos', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch('http://localhost:5000/api/timetable/week', {
        headers: { Authorization: `Bearer ${token}` },
      })
    ]);

    if (!todosRes.ok || !timetableRes.ok) {
      throw new Error('Failed to fetch planner data');
    }

    const todos = await todosRes.json();
    const timetable = await timetableRes.json();

    // Calculate stats
    const totalTodos = todos.length;
    const completedTodos = todos.filter(todo => todo.completed).length;
    const pendingTodos = totalTodos - completedTodos;
    
    // Count activities by day
    const activitiesByDay = {};
    Object.keys(timetable).forEach(day => {
      activitiesByDay[day] = timetable[day].length;
    });

    // Calculate total scheduled activities
    const totalActivities = Object.values(timetable).reduce((sum, activities) => sum + activities.length, 0);

    return {
      totalTodos,
      completedTodos,
      pendingTodos,
      completionRate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0,
      activitiesByDay,
      totalActivities
    };
  } catch (error) {
    console.error('Error fetching planner stats:', error);
    throw error;
  }
}; 