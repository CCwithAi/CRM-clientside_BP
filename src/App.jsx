import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import YoutubeTranscriptGrabber from './components/Internal/YoutubeTranscript';

function App() {
  const [clients, setClients] = useState(() => {
    const storedClients = localStorage.getItem('clients');
    return storedClients ? JSON.parse(storedClients) : [];
  });
  const [notes, setNotes] = useState(() => {
    const storedNotes = localStorage.getItem('notes');
    return storedNotes ? JSON.parse(storedNotes) : [];
  });
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addClient = (client) => {
    setClients([...clients, { ...client, id: uuidv4() }]);
  };

  const addNote = (note) => {
    setNotes([...notes, { ...note, id: uuidv4(), timestamp: new Date().toLocaleString() }]);
  };

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: uuidv4(), completed: false }]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const updateClient = (updatedClient) => {
    setClients(clients.map(client => client.id === updatedClient.id ? updatedClient : client));
  };

  const deleteClient = (clientId) => {
    setClients(clients.filter(client => client.id !== clientId));
  };

  return (
    <div className="app">
      <nav>
        <ul>
          <li><Link to="/">Clients</Link></li>
          <li><Link to="/internal">Internal</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<ClientList clients={clients} addClient={addClient} />} />
        <Route path="/client/:clientId" element={
          <ClientDetails
            clients={clients}
            notes={notes}
            addNote={addNote}
            tasks={tasks}
            addTask={addTask}
            toggleTask={toggleTask}
            updateClient={updateClient}
            deleteClient={deleteClient}
          />
        } />
        <Route path="/internal" element={<YoutubeTranscriptGrabber />} />
      </Routes>
    </div>
  );
}

function ClientList({ clients, addClient }) {
  const [newClient, setNewClient] = useState({
    name: '',
    address: '',
    email: '',
    website: '',
    status: 'Prospecting',
  });
  const [filterStatus, setFilterStatus] = useState('');

  const handleChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addClient(newClient);
    setNewClient({
      name: '',
      address: '',
      email: '',
      website: '',
      status: 'Prospecting',
    });
  };

  const filteredClients = filterStatus
    ? clients.filter((client) => client.status === filterStatus)
    : clients;

  return (
    <div className="section">
      <h2>Clients</h2>
      <div className="form-group">
        <label>Filter by Status</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All</option>
          <option value="Existing Client">Existing Client</option>
          <option value="Prospective Client">Prospective Client</option>
          <option value="Prospecting">Prospecting</option>
          <option value="Cold">Cold</option>
          <option value="Engaged">Engaged</option>
          <option value="Pitched">Pitched</option>
          <option value="Closing">Closing</option>
        </select>
      </div>
      <ul className="client-list">
        {filteredClients.map((client) => (
          <li key={client.id} className="client-item">
            <Link to={`/client/${client.id}`} className="client-link">
              <strong>{client.name}</strong>
              <p>Status: {client.status}</p>
            </Link>
          </li>
        ))}
      </ul>
      <h3>Add New Client</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={newClient.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" value={newClient.address} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={newClient.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Website</label>
          <input type="url" name="website" value={newClient.website} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={newClient.status} onChange={handleChange}>
            <option value="Existing Client">Existing Client</option>
            <option value="Prospective Client">Prospective Client</option>
            <option value="Prospecting">Prospecting</option>
            <option value="Cold">Cold</option>
            <option value="Engaged">Engaged</option>
            <option value="Pitched">Pitched</option>
            <option value="Closing">Closing</option>
          </select>
        </div>
        <button type="submit">Add Client</button>
      </form>
    </div>
  );
}

function ClientDetails({ clients, notes, addNote, tasks, addTask, toggleTask, updateClient, deleteClient }) {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const client = clients.find((c) => c.id === clientId);
  const [editClient, setEditClient] = useState(client ? { ...client } : null);

  useEffect(() => {
    if (client) {
      setEditClient({ ...client });
    }
  }, [client]);

  if (!client) {
    return <div>Client not found</div>;
  }

  const handleChange = (e) => {
    setEditClient({ ...editClient, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateClient(editClient);
  };

  const handleDelete = () => {
    deleteClient(clientId);
    navigate('/');
  };

  return (
    <div className="section">
      <button onClick={() => navigate('/')}>Back to Client List</button>
      <h2>{client.name}</h2>
      
      <h3>Contact Details</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <label>Address</label>
          <input type="text" name="address" value={editClient.address} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={editClient.email} onChange={handleChange} />
        </div>
         <div className="form-group">
          <label>Website</label>
          <input type="url" name="website" value={editClient.website} onChange={handleChange} />
        </div>
         <div className="form-group">
          <label>Contact Name</label>
          <input type="text" name="contactName" value={editClient.contactName} onChange={handleChange} />
        </div>
         <div className="form-group">
          <label>Contact Number</label>
          <input type="text" name="contactNumber" value={editClient.contactNumber} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={editClient.status} onChange={handleChange}>
            <option value="Existing Client">Existing Client</option>
            <option value="Prospective Client">Prospective Client</option>
            <option value="Prospecting">Prospecting</option>
            <option value="Cold">Cold</option>
            <option value="Engaged">Engaged</option>
            <option value="Pitched">Pitched</option>
            <option value="Closing">Closing</option>
          </select>
        </div>
        
        <h3>API Details</h3>
         <div className="form-group">
          <label>API Provider</label>
          <input type="text" name="apiProvider" value={editClient.apiProvider} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>API Key</label>
          <input type="text" name="apiKey" value={editClient.apiKey} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>API Core Costing</label>
          <input type="number" name="apiCoreCosting" value={editClient.apiCoreCosting} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>API Cost to Client</label>
          <input type="number" name="apiCostToClient" value={editClient.apiCostToClient} onChange={handleChange} />
        </div>
         <div className="form-group">
          <label>Website Address</label>
          <input type="url" name="websiteAddress" value={editClient.websiteAddress} onChange={handleChange} />
        </div>
         <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={editClient.username} onChange={handleChange} />
        </div>
         <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={editClient.password} onChange={handleChange} />
        </div>
        <button type="submit">Update Client</button>
      </form>
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleDelete}>Delete Client</button>
      </div>
      <NotesSection clientId={clientId} notes={notes} addNote={addNote} />
      <TasksSection clientId={clientId} tasks={tasks} addTask={addTask} toggleTask={toggleTask} />
    </div>
  );
}

function NotesSection({ clientId, notes, addNote }) {
  const [newNote, setNewNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addNote({ content: newNote, clientId: clientId });
    setNewNote('');
  };

  const filteredNotes = notes.filter((note) => note.clientId === clientId);

  return (
    <div className="section">
      <h3>Notes</h3>
      <ul className="note-list">
        {filteredNotes.map((note) => (
          <li key={note.id} className="note-item">
            <p>{note.content}</p>
            <small>{note.timestamp}</small>
          </li>
        ))}
      </ul>
      <h4>Add New Note</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} required />
        </div>
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
}

function TasksSection({ clientId, tasks, addTask, toggleTask }) {
  const [newTask, setNewTask] = useState({
    description: '',
    startDate: '',
    startTime: '',
    duration: '',
  });

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask({ ...newTask, clientId: clientId });
    setNewTask({ description: '', startDate: '', startTime: '', duration: '' });
  };

  const filteredTasks = tasks.filter((task) => task.clientId === clientId);

  return (
    <div className="section">
      <h3>Tasks</h3>
      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
            <span>{task.description}</span>
            <small>Start: {task.startDate} {task.startTime}, Duration: {task.duration} hours</small>
          </li>
        ))}
      </ul>
      <h4>Add New Task</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Description</label>
          <input type="text" name="description" value={newTask.description} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" name="startDate" value={newTask.startDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Start Time</label>
          <input type="time" name="startTime" value={newTask.startTime} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Duration (hours)</label>
          <input type="number" name="duration" value={newTask.duration} onChange={handleChange} required />
        </div>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
}

export default App;
