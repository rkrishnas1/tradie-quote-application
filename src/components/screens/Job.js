import React, { useState, useEffect } from 'react';
import '../../App.css';
import { API, Auth } from 'aws-amplify';
import Moment from 'moment-timezone';
import TradieDashboard from './TradieDashboard';
import CustomerDashboard from './CustomerDashboard';
import { MY_API, PATH, TRADIE_USER_GROUP } from '../constants';
import { makeStyles } from '@material-ui/core/styles';
import LoadingMask from '../common/LoadingMask';
import { DATE_FORMAT } from '../constants';

const initialFormState = {
  name: '',
  description: '',
  address: '',
  quoteRange: '',
  createdAt: '',
  updatedAt: '',
  dueDays: '',
  finalQuotes: [],
  hoursOfWork: '',
};

const useStyles = makeStyles(() => ({
  input: {
    margin: '5px',
  },
  button: {
    borderRadius: '5px',
  },
}));

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [currentUser, setCurrentUser] = useState('customer');
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  Auth.currentUserInfo().then((user) => setCurrentUser(user.username));
  console.log('Current user :', currentUser);
  const isTradie = TRADIE_USER_GROUP.includes(currentUser);

  useEffect(() => {
    fetchJobs();
  }, []);

  async function updateQuote(id, value) {
    console.log('Update the quote for the job id ', id, value);
    const updatedJobs = await jobs.map((job) => {
      if (job.id === id) {
        const quoteExistsForCurrentUser = job.finalQuotes.filter((finalQuote) => finalQuote.userName === currentUser);
        //If the quote exists for current user, update the quote else add new quote object
        if (quoteExistsForCurrentUser.length > 0) {
          job.finalQuotes.map((finalQuote) => {
            if (finalQuote.userName === currentUser) {
              finalQuote.quote = value;
            }
            return finalQuote;
          });
        } else {
          job.finalQuotes.push({ userName: currentUser, quote: value });
        }
      }
      return job;
    });
    setJobs(updatedJobs);

    //Update the jobs to DynamoDB
    const jobQuotesToBeUpdated = jobs.find((job) => job.id === id)?.finalQuotes;
    API.put(MY_API, PATH, {
      body: {
        id: id,
        finalQuotes: jobQuotesToBeUpdated,
      },
    });
  }

  async function fetchJobs() {
    setLoading(true);
    const jobsFromAPI = await API.get(MY_API, `${PATH}`, {});
    console.log('Jobs from API: ', jobsFromAPI.body);
    const result = JSON.parse(jobsFromAPI.body);
    await Promise.all(
      result?.map(async (job) => {
        //To calculate the winning quote
        var currentDate = Moment(new Date(), DATE_FORMAT);
        var dueDate = Moment(job.dueDate, DATE_FORMAT);
        const isDueDateCrossed = currentDate > dueDate;
        if (isDueDateCrossed) {
          const list = [];
          job.finalQuotes?.every((e) => list.push(e.quote));
          job.minQuote = Math.min.apply(null, list)?.toString();
        }
        return job;
      })
    );
    setJobs(result);
    setLoading(false);
  }

  async function createJob() {
    if (!formData.name || !formData.description) return;
    const createdDate = Moment().format('DD-MM-YYYY');
    formData.createdAt = createdDate;
    formData.dueDate = Moment(createdDate, 'DD-MM-YYYY').add(formData.dueDays, 'days').format('DD-MM-YYYY');
    await API.post(MY_API, PATH, {
      body: {
        ...formData,
      },
    });
    setJobs([...jobs, formData]);
    setFormData(initialFormState);
  }

  return (
    <div>
      <div style={{ marginRight: '6rem', marginBottom: '20px' }}>
        Current User : <b>{currentUser}</b>
      </div>
      {!isTradie && (
        <>
          <input
            className={classes.input}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Job Name"
            value={formData.name}
          />
          <input
            className={classes.input}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Job description"
            value={formData.description}
          />
          <input
            className={classes.input}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Address"
            value={formData.address}
          />
          <input
            className={classes.input}
            onChange={(e) => setFormData({ ...formData, hoursOfWork: e.target.value })}
            placeholder="Hours required"
            value={formData.hoursOfWork}
          />
          <input
            className={classes.input}
            onChange={(e) => setFormData({ ...formData, quoteRange: e.target.value })}
            placeholder="Acceptable quote range"
            value={formData.quoteRange}
          />
          <input
            className={classes.input}
            onChange={(e) => setFormData({ ...formData, dueDays: e.target.value })}
            placeholder="Duedate for quote"
            value={formData.dueDays}
          />
          <button className={classes.button} onClick={createJob}>
            Create Job
          </button>
        </>
      )}
      {loading && <LoadingMask />}
      {isTradie ? (
        <TradieDashboard jobs={jobs} formData={formData} updateQuote={updateQuote} currentUser={currentUser} />
      ) : (
        <CustomerDashboard jobs={jobs} formData={formData} setFormData={setFormData} />
      )}
    </div>
  );
};

export default Job;
