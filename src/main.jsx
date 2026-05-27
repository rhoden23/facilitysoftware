import React, { useState, useEffect, useMemo } from 'react';

// Firebase imports from your new firebase config file
import {
    db,
    auth,
    onAuthStateChanged,
    signInWithCustomToken,
    signInAnonymously,
    signOut,
    collection,
    onSnapshot,
    addDoc,
    serverTimestamp,
    query,
    doc,
    updateDoc,
    deleteDoc,
    where
} from './firebase.js';

// Services
import { callGeminiAPI as callGeminiAPIInternal } from './services.js';

// Components
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Screens
import LoadingScreen from './screens/LoadingScreen.jsx';
import ErrorDisplay from './screens/ErrorDisplay.jsx';
import FacilitySelectionScreen from './screens/FacilitySelectionScreen.jsx';
import LoginScreen from './screens/LoginScreen.jsx';
import SetupScreen from './screens/SetupScreen.jsx';

// Views
import DashboardView from './views/DashboardView.jsx';
import DataInsightsView from './views/DataInsightsView.jsx';
import MarketingView from './views/MarketingView.jsx';
import AdmissionsView from './views/AdmissionsView.jsx';
import SchedulingView from './views/SchedulingView.jsx';
import ResidentsView from './views/ResidentsView.jsx';
import MARView from './views/MARView.jsx';
import StaffView from './views/StaffView.jsx';
import ShiftLogView from './views/ShiftLogView.jsx';
import FinanceView from './views/FinanceView.jsx';
import InvoicingView from './views/InvoicingView.jsx';
import InventoryView from './views/InventoryView.jsx';
import AIToolsView from './views/AIToolsView.jsx';

// Modals
import ResidentModal from './modals/ResidentModal.jsx';
import AddStaffModal from './modals/AddStaffModal.jsx';
import ApplicantModal from './modals/ApplicantModal.jsx';
import ReferralModal from './modals/ReferralModal.jsx';
import AddMedicationModal from './modals/AddMedicationModal.jsx';
import ScheduleModal from './modals/ScheduleModal.jsx';
import TransactionModal from './modals/TransactionModal.jsx';
import AddInventoryModal from './modals/AddInventoryModal.jsx';
import EditInventoryModal from './modals/EditInventoryModal.jsx';
import InvoiceModal from './modals/InvoiceModal.jsx';
import ViewInvoiceModal from './modals/ViewInvoiceModal.jsx';
import SendInvoiceModal from './modals/SendInvoiceModal.jsx';
import AddAlwRecordModal from './modals/AddAlwRecordModal.jsx';
import AddDocumentModal from './modals/AddDocumentModal.jsx';
import AddStaffDocumentModal from './modals/AddStaffDocumentModal.jsx';
import AddPaymentModal from './modals/AddPaymentModal.jsx';
import GeminiModal from './modals/GeminiModal.jsx';
import AdministerMedModal from './modals/AdministerMedModal.jsx';


// --- Global Firebase Variables (provided by the environment) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'rcfe-multi-facility-app';
// firebaseConfig is now in firebase.js
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;


// --- Main App Component ---
export default function App() {
    // --- State Management ---
    const [view, setView] = useState('dashboard');
    const [currentUser, setCurrentUser] = useState(null);

    // Firebase State
    // db and auth are now imported, so no state needed for them
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Multi-facility State
    const [facilities, setFacilities] = useState([]);
    const [currentFacility, setCurrentFacility] = useState(null); // Now holds { id, name, address, phone }

    // Data State
    const [staff, setStaff] = useState([]);
    const [residents, setResidents] = useState([]);
    const [shiftLog, setShiftLog] = useState([]);
    const [medications, setMedications] = useState([]);
    const [medLog, setMedLog] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [referrals, setReferrals] = useState([]);
    const [finances, setFinances] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]); // --- New state for payments
    const [dailyAssignments, setDailyAssignments] = useState([]);
    const [alwRecords, setAlwRecords] = useState([]);
    const [documents, setDocuments] = useState([]); // Resident documents
    const [staffDocuments, setStaffDocuments] = useState([]); // Staff documents
    // Removed timeEntries state

    // UI State
    const [isResidentModalOpen, setIsResidentModalOpen] = useState(false);
    const [isAddStaffModalOpen, setAddStaffModalOpen] = useState(false);
    const [isAddMedicationModalOpen, setIsAddMedicationModalOpen] = useState(false);
    const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
    const [isApplicantModalOpen, setIsApplicantModalOpen] = useState(false); // Renamed
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false); // Added
    const [isTransactionModalOpen, setTransactionModalOpen] = useState(false);
    const [isAddInventoryModalOpen, setAddInventoryModalOpen] = useState(false);
    const [isEditInventoryModalOpen, setIsEditInventoryModalOpen] = useState(false);
    const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);
    const [isSendInvoiceModalOpen, setSendInvoiceModalOpen] = useState(false);
    const [isAddAlwRecordModalOpen, setAddAlwRecordModalOpen] = useState(false);
    const [isAddDocumentModalOpen, setAddDocumentModalOpen] = useState(false);
    const [isAddStaffDocumentModalOpen, setAddStaffDocumentModalOpen] = useState(false);
    const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false); // --- New modal state
    const [viewingInvoice, setViewingInvoice] = useState(null);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editingResident, setEditingResident] = useState(null);
    const [editingInventoryItem, setEditingInventoryItem] = useState(null);
    const [editingApplicant, setEditingApplicant] = useState(null); // Added
    const [editingReferral, setEditingReferral] = useState(null); // Added
    const [invoiceToSend, setInvoiceToSend] = useState(null);
    const [invoiceToPay, setInvoiceToPay] = useState(null); // --- New state for payment modal

    const [scheduleModalData, setScheduleModalData] = useState(null);
    const [selectedResident, setSelectedResident] = useState(null);
    const [selectedStaffMember, setSelectedStaffMember] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [needsSetup, setNeedsSetup] = useState(false);
    const [error, setError] = useState('');
    const [isCreatingFacility, setIsCreatingFacility] = useState(false);
    
    // Administer Med Modal
    const [administerModalData, setAdministerModalData] = useState(null);

    // Gemini API State
    const [isGeminiModalOpen, setGeminiModalOpen] = useState(false);
    const [geminiModalContent, setGeminiModalContent] = useState({ title: '', content: '' });
    const [isGeminiLoading, setIsGeminiLoading] = useState(false);

    // --- Firebase Initialization and Auth ---
    useEffect(() => {
        if (!auth) {
            setError("Authentication service failed to load.");
            setIsLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthReady(true);
            } else {
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (authError) {
                    console.error("Authentication failed:", authError);
                    setError("Could not connect to authentication service.");
                }
            }
        });
        return () => unsubscribe();
    }, []); // Removed 'auth' dependency as it's now imported and constant

    // --- Load External PDF Libraries ---
    useEffect(() => {
        // Load html2canvas
        if (!document.getElementById('html2canvas-script')) {
            const scriptHtml2Canvas = document.createElement('script');
            scriptHtml2Canvas.id = 'html2canvas-script';
            scriptHtml2Canvas.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            scriptHtml2Canvas.async = true;
            document.body.appendChild(scriptHtml2Canvas);
        }
        // Load jsPDF
        if (!document.getElementById('jspdf-script')) {
            const scriptJsPDF = document.createElement('script');
            scriptJsPDF.id = 'jspdf-script';
            scriptJsPDF.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            scriptJsPDF.async = true;
            document.body.appendChild(scriptJsPDF);
        }
    }, []); // Run only once on app load

    // --- Data Fetching from Firestore ---
    useEffect(() => {
        if (!isAuthReady || !db) return;

        setIsLoading(true);

        // 1. Fetch facilities
        const facilitiesQuery = query(collection(db, `/artifacts/${appId}/public/data/facilities`));
        const facilitiesUnsubscribe = onSnapshot(facilitiesQuery, (snapshot) => {
            const facilitiesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFacilities(facilitiesData);
            if (!snapshot.metadata.fromCache && facilitiesData.length === 0) {
                setNeedsSetup(true);
            }
            setIsLoading(false);
        }, (err) => {
            console.error("Error fetching facilities:", err);
            setError("Failed to load crucial facility data.");
            setIsLoading(false);
        });

        // 2. If a facility is selected, fetch its data
        let unsubscribers = [];
        if (currentFacility) {
            setIsLoading(true);
            const facilityId = currentFacility.id;
            const collectionsToFetch = {
                staff: 'staff', residents: 'residents', shiftLog: 'shiftLog',
                medications: 'medications', medLog: 'medLog', schedules: 'schedules',
                applicants: 'applicants', referrals: 'referrals', finances: 'finances',
                inventory: 'inventory', invoices: 'invoices', payments: 'payments', // Added payments
                dailyAssignments: 'dailyAssignments',
                alwRecords: 'alwRecords', documents: 'documents', staffDocuments: 'staffDocuments'
            };

            const promises = Object.entries(collectionsToFetch).map(([stateKey, collectionName]) => {
                return new Promise((resolve, reject) => {
                    const q = query(collection(db, `/artifacts/${appId}/public/data/facilities/${facilityId}/${collectionName}`));
                    const unsub = onSnapshot(q, (querySnapshot) => {
                        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                        const setters = {
                            staff: setStaff, residents: setResidents,
                            shiftLog: (d) => setShiftLog(d.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))),
                            medications: setMedications, medLog: setMedLog, schedules: setSchedules,
                            applicants: setApplicants,
                            referrals: (d) => setReferrals(d.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))),
                            finances: (d) => setFinances(d.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))),
                            inventory: setInventory,
                            invoices: (d) => setInvoices(d.sort((a, b) => (b.issueDate?.seconds || 0) - (a.issueDate?.seconds || 0))),
                            payments: (d) => setPayments(d.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0))), // Added payments setter
                            dailyAssignments: setDailyAssignments,
                            alwRecords: (d) => setAlwRecords(d.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0))),
                            documents: (d) => setDocuments(d.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0))),
                            staffDocuments: (d) => setStaffDocuments(d.sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0))),
                        };

                        if (setters[stateKey]) { setters[stateKey](data); }
                        resolve(unsub);
                    }, (err) => {
                        console.error(`Error fetching ${collectionName}:`, err);
                        setError(`Failed to load ${collectionName.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
                        reject(err);
                    });
                });
            });

            Promise.all(promises).then(unsubs => {
                unsubscribers = unsubs;
                setIsLoading(false);
            }).catch(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }

        return () => {
            facilitiesUnsubscribe();
            unsubscribers.forEach(unsub => unsub());
        };
    }, [isAuthReady, db, currentFacility]);

    // --- Gemini API Call Function ---
    const callGeminiAPI = async (prompt, title) => {
        setGeminiModalContent({ title, content: '' });
        setIsGeminiLoading(true);
        setGeminiModalOpen(true);
        
        try {
            const content = await callGeminiAPIInternal(prompt); // Call imported function
            setGeminiModalContent({ title, content: content || 'Could not generate a response...' });
        } catch (error) {
            console.error("Gemini API call failed:", error);
            setGeminiModalContent({ title: 'Error', content: `An error occurred: ${error.message}` });
        } finally {
            setIsGeminiLoading(false);
        }
    };


    // --- Data Handlers ---
    const addData = async (collectionName, data) => {
        if (!db || !currentFacility) { console.error("Missing db or currentFacility"); setError("Cannot save: connection lost."); return; }
        const facilityId = currentFacility.id;
        const userId = auth.currentUser?.uid || 'anonymous_setup';
        try {
            const docRef = await addDoc(collection(db, `/artifacts/${appId}/public/data/facilities/${facilityId}/${collectionName}`), { ...data, timestamp: serverTimestamp(), createdBy: userId });
            return docRef;
        } catch (err) { console.error(`Error adding to ${collectionName}:`, err); setError(`Could not save data: ${err.message}`); }
    };

    const deleteData = async (collectionName, docId) => {
        if (!db || !docId || !currentFacility) { console.error("Missing db, docId, or facility"); setError("Invalid delete operation."); return; }
        const facilityId = currentFacility.id;
        try { await deleteDoc(doc(db, `/artifacts/${appId}/public/data/facilities/${facilityId}/${collectionName}`, docId)); }
        catch (err) { console.error(`Error deleting from ${collectionName}:`, err); setError(`Could not delete data: ${err.message}`); }
    };

    const updateData = async (collectionName, docId, data) => {
        if (!db || !docId || !currentFacility) { console.error("Missing db, docId, or facility"); setError("Cannot update: connection lost."); return; }
        const facilityId = currentFacility.id;
        const docRef = doc(db, `/artifacts/${appId}/public/data/facilities/${facilityId}/${collectionName}`, docId);
        try { await updateDoc(docRef, { ...data, lastUpdated: serverTimestamp() }); }
        catch (err) { console.error(`Error updating ${collectionName}:`, err); setError(`Could not update data: ${err.message}`); }
    };


    const handleSaveResident = (residentData) => {
        const { id, ...data } = residentData; // Separate ID from the rest of the data
        if (id) { updateData('residents', id, data); }
        else { addData('residents', data); }
        setIsResidentModalOpen(false); setEditingResident(null);
    };
    const handleAddStaff = (staffData) => { addData('staff', staffData); setAddStaffModalOpen(false); };
    const handleFirstAdmin = async ({ facilityName, facilityAddress, facilityPhone, ...staffData }) => { // Added address/phone
        if (!db) return;
        setIsLoading(true); setError('');
        try {
            // Save facility info
            const facilityRef = await addDoc(collection(db, `/artifacts/${appId}/public/data/facilities`), {
                name: facilityName,
                address: facilityAddress,
                phone: facilityPhone,
                createdAt: serverTimestamp()
            });
            const newFacility = { id: facilityRef.id, name: facilityName, address: facilityAddress, phone: facilityPhone };

            const adminStaffData = { ...staffData, role: 'Admin', timestamp: serverTimestamp() };
            const staffRef = await addDoc(collection(db, `/artifacts/${appId}/public/data/facilities/${newFacility.id}/staff`), adminStaffData);

            setCurrentFacility(newFacility); // Set the full facility object
            setCurrentUser({ id: staffRef.id, ...adminStaffData });
            setNeedsSetup(false); setIsCreatingFacility(false);
        } catch (err) { console.error("Setup error:", err); setError(`Setup failed: ${err.message}`); }
        finally { setIsLoading(false); }
    };

    const handleAddShiftLog = (logEntry) => { addData('shiftLog', logEntry); };
    const handleSaveTransaction = (transactionData) => {
        const { id, ...data } = transactionData;
        if (id) { updateData('finances', id, data); }
        else { addData('finances', data); }
        setTransactionModalOpen(false); setEditingTransaction(null);
    };
    const handleDeleteTransaction = (id) => deleteData('finances', id);
    const handleAddInventory = (inventoryData) => { addData('inventory', inventoryData); setAddInventoryModalOpen(false); };
    const handleUpdateInventoryStatus = (itemId, newStatus) => { updateData('inventory', itemId, { status: newStatus }); };
    const handleSaveInventoryEdit = (inventoryData) => {
        const { id, ...data } = inventoryData;
        if (id) { updateData('inventory', id, data); }
        setIsEditInventoryModalOpen(false); setEditingInventoryItem(null);
    };
    const handleDeleteInventory = (id) => { if (window.confirm("Delete item?")) { deleteData('inventory', id); } };

    // --- Invoice & Payment Handlers ---
    const handleSaveInvoice = (invoiceData) => { addData('invoices', invoiceData); setInvoiceModalOpen(false); };
    const handleUpdateInvoiceStatus = (id, status) => updateData('invoices', id, { status });
    const handleDeleteInvoice = (id) => {
        if (window.confirm("Delete invoice? This will NOT delete associated payments.")) {
            deleteData('invoices', id);
        }
    };
    const handleSavePayment = (paymentData) => {
        addData('payments', paymentData);
        // Also update the invoice status to 'Sent' if it was 'Draft'
        if (invoiceToPay?.status === 'Draft') {
            updateData('invoices', paymentData.invoiceId, { status: 'Sent' });
        }
        setIsAddPaymentModalOpen(false);
        setInvoiceToPay(null);
    };
    // --- End Invoice & Payment Handlers ---

    const handleSaveSchedule = (scheduleData) => {
        const dataToSave = { ...scheduleData, staffId: scheduleData.staffId || currentUser?.id };
        const { id, ...restOfData } = dataToSave;
        if (id) { updateData('schedules', id, restOfData); }
        else { if (restOfData.staffId) { addData('schedules', restOfData); } else { console.error("Missing staffId"); setError("Save failed: Staff info missing."); } }
        setScheduleModalOpen(false);
    };
    const handleDeleteSchedule = (scheduleId) => { deleteData('schedules', scheduleId); };

    // Updated Applicant Handlers
    const handleSaveApplicant = (applicantData) => {
        const { id, ...data } = applicantData;
        if (id) {
            updateData('applicants', id, data);
        } else {
            addData('applicants', { ...data, status: 'Inquiry' }); // Add with default status
        }
        setIsApplicantModalOpen(false);
        setEditingApplicant(null);
    };
    const handleDeleteApplicant = (id) => {
        if (window.confirm("Are you sure you want to delete this applicant?")) { // Added confirmation
            deleteData('applicants', id);
        }
    };

    // --- New Referral Handlers ---
    const handleSaveReferral = (referralData) => {
        const { id, ...data } = referralData;
        if (id) {
            updateData('referrals', id, data);
        } else {
            addData('referrals', { ...data, status: 'Pending' }); // Add with default status
        }
        setIsReferralModalOpen(false);
        setEditingReferral(null);
    };
    const handleDeleteReferral = (id) => {
        if (window.confirm("Are you sure you want to delete this referral?")) { // Added confirmation
            deleteData('referrals', id);
        }
    };
    // --- End New Referral Handlers ---

    const handleAddMedication = (medicationData) => {
        const staffMember = staff.find(s => s.id === medicationData.assignedStaffId);
        const dataToSave = { ...medicationData, residentId: selectedResident.id, assignedStaffName: staffMember ? staffMember.name : 'Unassigned' };
        addData('medications', dataToSave);
        setIsAddMedicationModalOpen(false);
        setSelectedResident(null);
    };
    const handleDeleteMedication = (id) => deleteData('medications', id);
    const handleUpdateApplicantStatus = (applicantId, newStatus) => { updateData('applicants', applicantId, { status: newStatus }); };
    const handleSaveDailyAssignment = (assignmentData) => {
        const existing = dailyAssignments.find(a => a.date === assignmentData.date);
        const { id, ...data } = assignmentData;
        if (existing) { updateData('dailyAssignments', existing.id, data); }
        else { addData('dailyAssignments', data); }
    };
    const handleSaveAlwRecord = (recordData) => { addData('alwRecords', { ...recordData, residentId: selectedResident.id }); setAddAlwRecordModalOpen(false); setSelectedResident(null); };
    const handleDeleteAlwRecord = (id) => deleteData('alwRecords', id);
    const handleSaveDocumentRecord = (docData) => { addData('documents', { ...docData, residentId: selectedResident.id }); setAddDocumentModalOpen(false); setSelectedResident(null); };
    const handleDeleteDocumentRecord = (id) => deleteData('documents', id);
    const handleSaveStaffDocumentRecord = (docData) => { if (!selectedStaffMember) return; addData('staffDocuments', { ...docData, staffId: selectedStaffMember.id }); setAddStaffDocumentModalOpen(false); setSelectedStaffMember(null); };
    const handleDeleteStaffDocumentRecord = (id) => deleteData('staffDocuments', id);
    const handleSaveMedLog = ({ logId, medicationId, residentId, staffId, status }) => {
        const staffMember = staff.find(s => s.id === staffId);
        if (!staffMember) { setError("Log failed: staff not found."); console.error("Staff not found:", staffId); return; }
        const logData = { medicationId, residentId, administeredBy: staffMember.name, staffId: staffMember.id, status, timestamp: serverTimestamp() }; // Ensure timestamp is added
        if (logId) {
            // Correctly exclude id for update
            const dataToUpdate = { medicationId, residentId, administeredBy: staffMember.name, staffId: staffMember.id, status, timestamp: serverTimestamp() };
            updateData('medLog', logId, dataToUpdate);
        } else {
            addData('medLog', logData);
        }
        setAdministerModalData(null); // Close modal
    };
    const handleDeleteMedLog = (logId) => { 
        if (!logId) { console.error("Invalid logId for delete"); return; } 
        deleteData('medLog', logId); 
        setAdministerModalData(null); // Close modal
    }

    const handleLogout = () => { setCurrentUser(null); setView('dashboard'); }
    const clearAllData = () => {
        setStaff([]); setResidents([]); setShiftLog([]); setMedications([]); setMedLog([]); setSchedules([]);
        setApplicants([]); setReferrals([]); setFinances([]); setInventory([]); setInvoices([]); setPayments([]); // Clear payments
        setDailyAssignments([]); setAlwRecords([]); setDocuments([]); setStaffDocuments([]);
    };
    const handleSwitchFacility = () => { setCurrentFacility(null); setCurrentUser(null); clearAllData(); setView('dashboard'); };


    // --- Render Logic ---

    if (isLoading) return <LoadingScreen />;
    if (error) return <ErrorDisplay message={error} />;

    if (needsSetup) { return <SetupScreen onSave={handleFirstAdmin} />; }
    if (isCreatingFacility) { return <SetupScreen onSave={handleFirstAdmin} onCancel={() => setIsCreatingFacility(false)} />; }
    if (!currentFacility) { return <FacilitySelectionScreen facilities={facilities} onSelect={setCurrentFacility} onAddNew={() => setIsCreatingFacility(true)} />; }
    if (!currentUser) { return <LoginScreen staffList={staff} onLogin={setCurrentUser} currentFacility={currentFacility} />; }

    // Main App View
    return (
        <ErrorBoundary>
            <div className="flex h-screen bg-gray-100 font-sans">
                <Sidebar view={view} setView={setView} currentUser={currentUser} facilityName={currentFacility.name} onSwitchFacility={handleSwitchFacility} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <Header staffName={currentUser.name} onLogout={handleLogout} />
                    {view === 'dashboard' && <DashboardView residents={residents} staff={staff} medications={medications} medLog={medLog} referrals={referrals} shiftLog={shiftLog} callGeminiAPI={callGeminiAPI} />}
                    {view === 'data_insights' && <DataInsightsView residents={residents} medLog={medLog} shiftLog={shiftLog} />}
                    {view === 'marketing' && <MarketingView
                        applicants={applicants}
                        referrals={referrals}
                        onAddApplicant={() => { setEditingApplicant(null); setIsApplicantModalOpen(true); }} // Open modal for add
                        onEditApplicant={(applicant) => { setEditingApplicant(applicant); setIsApplicantModalOpen(true); }} // Open modal for edit
                        onDeleteApplicant={handleDeleteApplicant}
                        onAddReferral={() => { setEditingReferral(null); setIsReferralModalOpen(true); }} // Open modal for add
                        onEditReferral={(referral) => { setEditingReferral(referral); setIsReferralModalOpen(true); }} // Open modal for edit
                        onDeleteReferral={handleDeleteReferral}
                        onUpdateStatus={handleUpdateApplicantStatus}
                    />}
                    {view === 'scheduling' && <SchedulingView schedules={schedules} staff={staff} dailyAssignments={dailyAssignments} onOpenScheduleModal={(data) => { setScheduleModalData(data); setScheduleModalOpen(true); }} onDeleteSchedule={handleDeleteSchedule} onSaveAssignment={handleSaveDailyAssignment} currentUser={currentUser} />}
                    {view === 'residents' && <ResidentsView residents={residents} shiftLog={shiftLog} alwRecords={alwRecords} documents={documents} onAddResident={() => { setEditingResident(null); setIsResidentModalOpen(true); }} onEditResident={(r) => { setEditingResident(r); setIsResidentModalOpen(true); }} onAddMedication={(resident) => { setSelectedResident(resident); setAddMedicationModalOpen(true); }} onDeleteMedication={handleDeleteMedication} medications={medications} staff={staff} onAddAlwRecord={(resident) => { setSelectedResident(resident); setAddAlwRecordModalOpen(true); }} onDeleteAlwRecord={handleDeleteAlwRecord} onAddDocument={(resident) => { setSelectedResident(resident); setAddDocumentModalOpen(true); }} onDeleteDocument={handleDeleteDocumentRecord} currentUser={currentUser} />}
                    {view === 'mar' && <MARView medications={medications} residents={residents} staff={staff} medLog={medLog} onSaveLog={handleSaveMedLog} onDeleteLog={handleDeleteMedLog} currentUser={currentUser} onOpenModal={(data) => setAdministerModalData(data)} />}
                    {view === 'staff' && <StaffView staff={staff} staffDocuments={staffDocuments} onAddStaff={() => setAddStaffModalOpen(true)} onAddDocument={(staffMember) => { setSelectedStaffMember(staffMember); setAddStaffDocumentModalOpen(true); }} onDeleteDocument={handleDeleteStaffDocumentRecord} currentUser={currentUser} />}
                    {view === 'shift_log' && <ShiftLogView logs={shiftLog} residents={residents} onAddLog={handleAddShiftLog} currentStaffName={currentUser.name} />}
                    {view === 'admissions' && <AdmissionsView />}
                    {view === 'invoicing' && <InvoicingView invoices={invoices} residents={residents} payments={payments} onNewInvoice={() => setInvoiceModalOpen(true)} onUpdateStatus={handleUpdateInvoiceStatus} onDelete={handleDeleteInvoice} onSetViewingInvoice={setViewingInvoice} onSendInvoice={(inv) => { setInvoiceToSend(inv); setSendInvoiceModalOpen(true); }} onAddPayment={(inv) => { setInvoiceToPay(inv); setIsAddPaymentModalOpen(true); }} />}
                    {view === 'ai_tools' && <AIToolsView residents={residents} callGeminiAPI={callGeminiAPI} />}
                    {view === 'finances' && <FinanceView transactions={finances} onAddTransaction={() => { setEditingTransaction(null); setTransactionModalOpen(true); }} onEditTransaction={(t) => { setEditingTransaction(t); setTransactionModalOpen(true); }} onDeleteTransaction={handleDeleteTransaction} callGeminiAPI={callGeminiAPI} />}
                    {view === 'inventory' && <InventoryView items={inventory} onAddItem={() => setAddInventoryModalOpen(true)} onUpdateItemStatus={handleUpdateInventoryStatus} onEditItem={(item) => { setEditingInventoryItem(item); setIsEditInventoryModalOpen(true); }} onDeleteItem={handleDeleteInventory} />}
                </main>

                {/* Modals */}
                {isResidentModalOpen && <ResidentModal onClose={() => {setIsResidentModalOpen(false); setEditingResident(null);}} onSave={handleSaveResident} initialData={editingResident} />}
                {isAddStaffModalOpen && <AddStaffModal onClose={() => setAddStaffModalOpen(false)} onSave={handleAddStaff} currentUser={currentUser} />}
                {isApplicantModalOpen && <ApplicantModal onClose={() => { setIsApplicantModalOpen(false); setEditingApplicant(null); }} onSave={handleSaveApplicant} initialData={editingApplicant} />}
                {isReferralModalOpen && <ReferralModal onClose={() => { setIsReferralModalOpen(false); setEditingReferral(null); }} onSave={handleSaveReferral} initialData={editingReferral} />}
                
                {isAddMedicationModalOpen && selectedResident && <AddMedicationModal resident={selectedResident} staffList={staff} onClose={() => { setAddMedicationModalOpen(false); setSelectedResident(null); }} onSave={handleAddMedication} />}
                {isScheduleModalOpen && <ScheduleModal onClose={() => setScheduleModalOpen(false)} onSave={handleSaveSchedule} staffList={staff} initialData={scheduleModalData} currentUser={currentUser} />}
                {isTransactionModalOpen && <TransactionModal onClose={() => { setTransactionModalOpen(false); setEditingTransaction(null); }} onSave={handleSaveTransaction} initialData={editingTransaction} />}
                {isAddInventoryModalOpen && <AddInventoryModal onClose={() => setAddInventoryModalOpen(false)} onSave={handleAddInventory} />}
                {isEditInventoryModalOpen && editingInventoryItem && <EditInventoryModal onClose={() => { setIsEditInventoryModalOpen(false); setEditingInventoryItem(null); }} onSave={handleSaveInventoryEdit} initialData={editingInventoryItem} />}
                {isInvoiceModalOpen && <InvoiceModal onClose={() => setInvoiceModalOpen(false)} residents={residents} onSave={handleSaveInvoice} />}
                
                {viewingInvoice && <ViewInvoiceModal invoice={viewingInvoice} payments={payments} onClose={() => setViewingInvoice(null)} currentFacility={currentFacility} />}
                {isSendInvoiceModalOpen && invoiceToSend && <SendInvoiceModal invoice={invoiceToSend} resident={residents.find(r => r.id === invoiceToSend?.residentId)} onClose={() => setSendInvoiceModalOpen(false)} onUpdateStatus={handleUpdateInvoiceStatus} />}
                {isAddAlwRecordModalOpen && selectedResident && <AddAlwRecordModal onClose={() => { setAddAlwRecordModalOpen(false); setSelectedResident(null); }} onSave={handleSaveAlwRecord} resident={selectedResident} />}
                {isAddDocumentModalOpen && selectedResident && <AddDocumentModal onClose={() => { setAddDocumentModalOpen(false); setSelectedResident(null); }} onSave={handleSaveDocumentRecord} resident={selectedResident} />}
                {isAddStaffDocumentModalOpen && selectedStaffMember && <AddStaffDocumentModal onClose={() => { setAddStaffDocumentModalOpen(false); setSelectedStaffMember(null); }} onSave={handleSaveStaffDocumentRecord} staffMember={selectedStaffMember} />}
                
                {isAddPaymentModalOpen && invoiceToPay && <AddPaymentModal onClose={() => { setIsAddPaymentModalOpen(false); setInvoiceToPay(null); }} onSave={handleSavePayment} invoice={invoiceToPay} />}
                
                {administerModalData && <AdministerMedModal data={administerModalData} staffList={staff} onClose={() => setAdministerModalData(null)} onConfirm={handleSaveMedLog} onDelete={handleDeleteMedLog} currentUser={currentUser} />}
                
                {isGeminiModalOpen && <GeminiModal title={geminiModalContent.title} content={geminiModalContent.content} isLoading={isGeminiLoading} onClose={() => setGeminiModalOpen(false)} />}
            </div>
        </ErrorBoundary>
    );
}
