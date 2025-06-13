// src/components/TaskCard.jsx
function TaskCard({ task }) {
  const statusColor =
    task.status === "Completed"
      ? "bg-green-100 text-green-700 border-green-200"
      : task.status === "In Progress"
      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
      : "bg-gray-100 text-gray-700 border-gray-200";
  
  const statusIcon =
    task.status === "Completed"
      ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
      : task.status === "In Progress"
      ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
      : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      );

  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  const daysRemaining = getDaysRemaining();
  
  const getDueDateClasses = () => {
    if (daysRemaining === null) return "text-gray-400";
    if (daysRemaining < 0) return "text-red-600 font-medium";
    if (daysRemaining <= 2) return "text-orange-600 font-medium";
    if (daysRemaining <= 5) return "text-yellow-600";
    return "text-green-600";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const createdAt = task.createdAt ? formatDate(task.createdAt) : null;

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${statusColor} hover:shadow-2xl transition-all flex flex-col gap-3`}>
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-indigo-700">{task.title}</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor} flex items-center`}>
          {statusIcon}
          {task.status}
        </span>
      </div>
      
      <p className="mt-1 text-gray-700 flex-grow">{task.description}</p>
      
      <div className="border-t border-gray-100 pt-3 mt-1">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className={getDueDateClasses()}>
              Due: {task.dueDate ? formatDate(task.dueDate) : "N/A"}
              {daysRemaining !== null && (
                <span className="ml-1">
                  {daysRemaining < 0 
                    ? `(${Math.abs(daysRemaining)} days overdue)` 
                    : daysRemaining === 0 
                      ? "(Due today)" 
                      : `(${daysRemaining} days left)`}
                </span>
              )}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-between items-center text-sm text-gray-500">
          {task?.userId?.username && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Assigned to: <span className="font-medium text-indigo-600">{task.userId.username}</span></span>
            </div>
          )}
          
          {createdAt && (
            <div className="text-xs text-gray-400 mt-1">
              Created: {createdAt}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
