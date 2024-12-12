export const getEvents = () => {
    const events = localStorage.getItem('events');
    return events ? JSON.parse(events) : [];
  };
  
  export const saveEvent = (event) => {
    const events = getEvents();
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
  };
  
  export const deleteEvent = (id) => {
    const events = getEvents().filter(event => event.id !== id);
    localStorage.setItem('events', JSON.stringify(events));
  };
  