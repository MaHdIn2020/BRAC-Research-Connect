import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit2, Trash2, X, Calendar, Users } from 'lucide-react';

// Mock data for individuals
const mockIndividuals = [
  { id: 1, name: 'Dr. Sarah Ahmed' },
  { id: 2, name: 'Dr. Mohammad Rahman' },
  { id: 3, name: 'Dr. Fatima Khan' },
  { id: 4, name: 'Dr. Ali Hassan' },
  { id: 5, name: 'Dr. Nadia Islam' },
  { id: 6, name: 'Dr. Omar Faruk' },
  { id: 7, name: 'Dr. Rashida Begum' },
  { id: 8, name: 'Dr. Karim Abdullah' }
];

// Mock data for announcements
const initialAnnouncements = [
  {
    id: 1,
    title: 'Thesis Defense Schedule - Fall 2024',
    description: 'All students must register for their thesis defense slots before December 15th. Please contact your supervisor for guidance.',
    individuals: [1, 2, 3],
    date: '2024-12-10',
    time: '10:00',
    createdAt: '2024-11-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'New Research Guidelines',
    description: 'Updated guidelines for thesis research methodology have been published. All students must review these changes.',
    individuals: [4, 5],
    date: '2024-12-08',
    time: '14:30',
    createdAt: '2024-11-10T14:30:00Z'
  },
  {
    id: 3,
    title: 'Workshop: Academic Writing',
    description: 'Join us for an intensive academic writing workshop specifically designed for thesis students.',
    individuals: [1, 6, 7, 8],
    date: '2024-12-12',
    time: '09:00',
    createdAt: '2024-11-12T09:00:00Z'
  }
];

const Announcement = () => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState(initialAnnouncements);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIndividual, setFilterIndividual] = useState('');
  console.log(setFilterIndividual)
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    individuals: [],
    date: '',
    time: ''
  });

  // Filter and search logic
  useEffect(() => {
    let filtered = announcements;
    
    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterIndividual) {
      filtered = filtered.filter(announcement =>
        announcement.individuals.includes(parseInt(filterIndividual))
      );
    }
    
    setFilteredAnnouncements(filtered);
  }, [searchTerm, filterIndividual, announcements]);

  // Get individual name by ID
  const getIndividualName = (id) => {
    const individual = mockIndividuals.find(ind => ind.id === id);
    return individual ? individual.name : 'Unknown';
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIndividualToggle = (individualId) => {
    setFormData(prev => ({
      ...prev,
      individuals: prev.individuals.includes(individualId)
        ? prev.individuals.filter(id => id !== individualId)
        : [...prev.individuals, individualId]
    }));
  };

  const handleSelectAll = () => {
    setFormData(prev => ({
        ...prev,
        individuals: mockIndividuals.map(ind => ind.id)
    }));
    };

    const handleDeselectAll = () => {
    setFormData(prev => ({
        ...prev,
        individuals: []
    }));
    };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      individuals: [],
      date: '',
      time: ''
    });
  };

  // CRUD operations
  const handleCreate = () => {
    const newAnnouncement = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = () => {
    setAnnouncements(prev =>
      prev.map(ann =>
        ann.id === selectedAnnouncement.id
          ? { ...ann, ...formData }
          : ann
      )
    );
    setShowEditModal(false);
    resetForm();
    setSelectedAnnouncement(null);
  };

  const handleDelete = () => {
    setAnnouncements(prev =>
      prev.filter(ann => ann.id !== selectedAnnouncement.id)
    );
    setShowDeleteModal(false);
    setSelectedAnnouncement(null);
  };

  // Modal handlers
  const openViewModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowViewModal(true);
  };

  const openEditModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.description,
      individuals: announcement.individuals,
      date: announcement.date,
      time: announcement.time
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDeleteModal(true);
  };

  const closeAllModals = () => {
    setShowCreateModal(false);
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedAnnouncement(null);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Announcements Management
          </h1>
          <p className="text-slate-600 dark:text-gray-400">
            Manage announcements for Study Sync thesis portal
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search announcements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#7b1e3c] focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Announcement
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Individuals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {filteredAnnouncements.map((announcement) => (
                  <tr key={announcement.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {announcement.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 dark:text-gray-400 max-w-xs truncate">
                        {announcement.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 dark:text-gray-400">
                        {announcement.individuals.length} individual(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 dark:text-gray-400">
                        {announcement.date} at {announcement.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openViewModal(announcement)}
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(announcement)}
                          className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(announcement)}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredAnnouncements.length === 0 && (
              <div className="text-center py-8 text-slate-500 dark:text-gray-400">
                No announcements found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {showCreateModal ? 'Create Announcement' : 'Edit Announcement'}
              </h2>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#7b1e3c] focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Enter announcement title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#7b1e3c] focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  placeholder="Enter announcement description"
                />
              </div>

                {/* Individuals */}
                <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                    <Users className="inline w-4 h-4 mr-1" />
                    Select Individuals
                </label>
                
                {/* Select All / Deselect All Buttons */}
                <div className="flex gap-2 mb-2">
                    <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs px-2 py-1 bg-[#7b1e3c] text-white rounded hover:bg-[#651730] transition"
                    >
                    Select All
                    </button>
                    <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                    >
                    Deselect All
                    </button>
                </div>
                
                <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-slate-600 rounded-lg p-3 bg-white dark:bg-slate-700">
                    {mockIndividuals.map(individual => (
                    <label key={individual.id} className="flex items-center space-x-2 mb-2">
                        <input
                        type="checkbox"
                        checked={formData.individuals.includes(individual.id)}
                        onChange={() => handleIndividualToggle(individual.id)}
                        className="rounded border-gray-300 text-[#7b1e3c] focus:ring-[#7b1e3c]"
                        />
                        <span className="text-sm text-slate-700 dark:text-gray-300">
                        {individual.name}
                        </span>
                    </label>
                    ))}
                </div>
                </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#7b1e3c] focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#7b1e3c] focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={closeAllModals}
                className="px-4 py-2 text-slate-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={showCreateModal ? handleCreate : handleEdit}
                className="px-4 py-2 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition"
              >
                {showCreateModal ? 'Create' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                View Announcement
              </h2>
              <button
                onClick={closeAllModals}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-slate-700 dark:text-gray-300 mb-1">Title</h3>
                <p className="text-slate-900 dark:text-white">{selectedAnnouncement.title}</p>
              </div>

              <div>
                <h3 className="font-medium text-slate-700 dark:text-gray-300 mb-1">Description</h3>
                <p className="text-slate-900 dark:text-white">{selectedAnnouncement.description}</p>
              </div>

              <div>
                <h3 className="font-medium text-slate-700 dark:text-gray-300 mb-1">Assigned Individuals</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAnnouncement.individuals.map(individualId => (
                    <span
                      key={individualId}
                      className="inline-block px-2 py-1 bg-[#7b1e3c] text-white text-sm rounded-full"
                    >
                      {getIndividualName(individualId)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-gray-300 mb-1">Date</h3>
                  <p className="text-slate-900 dark:text-white">{selectedAnnouncement.date}</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700 dark:text-gray-300 mb-1">Time</h3>
                  <p className="text-slate-900 dark:text-white">{selectedAnnouncement.time}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={closeAllModals}
                className="px-4 py-2 bg-[#7b1e3c] text-white rounded-lg hover:bg-[#651730] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedAnnouncement && (
        <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                    Delete Announcement
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <p className="text-slate-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete "{selectedAnnouncement.title}"?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeAllModals}
                  className="px-4 py-2 text-slate-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcement;