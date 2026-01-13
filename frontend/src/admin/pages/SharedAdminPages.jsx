// Re-exporting Reception components for Admin use
// Admin has full access to these features, so reusing is cleaner than duplicating logic.

import PatientManager from '../../reception/pages/PatientManager';
import AppointmentManager from '../../reception/pages/AppointmentManager';
import BillingManager from '../../reception/pages/BillingManager';

// We can wrap them if we need to inject specific props or permissions, but for now direct reuse is fine.
export { PatientManager, AppointmentManager, BillingManager };
