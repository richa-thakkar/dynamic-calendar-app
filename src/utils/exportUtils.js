import dayjs from 'dayjs';

export const exportEventsToJSON = (events, month) => {
  const monthEvents = events.filter(event => 
    dayjs(event.date).format('YYYY-MM') === month.format('YYYY-MM')
  );
  
  const dataStr = JSON.stringify(monthEvents, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `calendar-events-${month.format('YYYY-MM')}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const exportEventsToCSV = (events, month) => {
  const monthEvents = events.filter(event => 
    dayjs(event.date).format('YYYY-MM') === month.format('YYYY-MM')
  );
  
  const headers = ['Date', 'Title', 'Description', 'Start Time', 'End Time'];
  const rows = monthEvents.map(event => [
    dayjs(event.date).format('YYYY-MM-DD'),
    event.title,
    event.description,
    event.startTime,
    event.endTime
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);
  const exportFileDefaultName = `calendar-events-${month.format('YYYY-MM')}.csv`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};
