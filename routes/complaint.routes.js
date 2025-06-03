import {Router} from 'express';
import { publishAComplaint,getAllComplaints } from '../controllers/complaint.controller.js';
import {Complaint} from "../models/complaint.model.js"

// import { verifyJWT } from '../middlewares/auth.middelware.js';

const router = Router();

// router.use(verifyJWT);

router
.route("/complaint")
.post(
    publishAComplaint
); 
router.get("/complaint", (req, res) => {
    res.render("complaint"); 
});
router.get("/complaint_telugu", (req, res) => {
    res.render("complaint_telugu"); 
});  
// router.route("/allComplaints").post(getAllComplaints)
router.get('/allComplaints', async (req, res) => {
    try {
        // Fetch all complaints from the database
        const schoolCounts = await Complaint.aggregate([
            {
              $group: {
                _id: "$schoolName",
                count: { $sum: 1 }
              }
            },
            {
              $sort: { count: -1 }
            }
          ]);
      
          // Extract sorted school names
          const sortedSchools = schoolCounts.map(school => school._id);
      
          // Step 2: Fetch all records
          const allRecords = await Complaint.find({});
      
          // Map school names to their records
          const schoolRecords = sortedSchools.reduce((acc, schoolName) => {
            acc[schoolName] = allRecords.filter(record => record.schoolName === schoolName);
            return acc;
          }, {});
      
          // Step 3: Combine and order records by frequency
          const complaints = sortedSchools.reduce((acc, schoolName) => {
            return acc.concat(schoolRecords[schoolName]);
          }, []);
      
        res.render('admin_complaint', { complaints });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;