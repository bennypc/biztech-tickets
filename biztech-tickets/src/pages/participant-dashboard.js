import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/router';
import { useState, Fragment, useEffect } from 'react';
import { useUser } from '../contexts/UserContext.js'; // Ensure this path points to the correct location
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  Bars3Icon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/20/solid';

import { app } from '../../firebaseConfig';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
  addDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
var randomstring = require('randomstring');

const db = getFirestore(app);

const navigation = [
  { name: 'Tickets', href: '#', icon: FolderIcon, current: true },
  { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: false }
];
const teams = [
  {
    id: 1,
    name: 'BizTeching BizTechers',
    href: '#',
    initial: 'P',
    current: false
  }
];
const statuses = {
  pending: 'text-yellow-500 bg-yellow-100/10',
  completed: 'text-green-400 bg-green-400/10',
  active: 'text-rose-400 bg-rose-400/10'
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function timeAgo(timestamp) {
  if (!timestamp) return 'Just now';

  const now = new Date();
  const questionDate = timestamp.toDate();
  const secondsAgo = Math.floor((now - questionDate) / 1000);

  if (secondsAgo < 60) return `${secondsAgo} seconds ago`;
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
  return `${Math.floor(secondsAgo / 86400)} days ago`;
}

export default function ParticipantDashboard() {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const router = useRouter();

  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('Front-end');
  const [description, setDescription] = useState('');
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tickets'), (snapshot) => {
      const fetchedQuestions = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id
      }));
      setQuestions(fetchedQuestions);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);
  async function submitQuestion() {
    const questionID = randomstring.generate(10);
    const fullName = `${user.firstName} ${user.lastName}`;
    const timestamp = new Date();

    const newQuestion = {
      id: questionID,
      name: fullName,
      teamName: user.teamName,
      question,
      category,
      description,
      status: 'active',
      timestamp: serverTimestamp()
    };

    try {
      const docRef = await addDoc(collection(db, 'tickets'), newQuestion);
      console.log('Document written with ID: ', docRef.id);
      setQuestion('');
      setCategory('Front-end');
      setDescription('');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  useEffect(() => {
    if (!user || !user.firstName || !user.lastName) {
      router.push('/'); // Redirect to root if user is not logged in
    }
  }, [user, router]);

  return (
    <div className='bg-[#070f21] min-h-screen'>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as='div'
            className='relative z-50 xl:hidden'
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-gray-900/80' />
            </Transition.Child>

            <div className='fixed inset-0 flex'>
              <Transition.Child
                as={Fragment}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <Dialog.Panel className='relative mr-16 flex w-full max-w-xs flex-1'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <div className='absolute left-full top-0 flex w-16 justify-center pt-5'>
                      <button
                        type='button'
                        className='-m-2.5 p-2.5'
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className='sr-only'>Close sidebar</span>
                        <XMarkIcon
                          className='h-6 w-6 text-white'
                          aria-hidden='true'
                        />
                      </button>
                    </div>
                  </Transition.Child>

                  <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10'>
                    <div className='flex h-16 shrink-0 items-center'>
                      <img
                        className='h-10 w-auto mt-2 pr-4'
                        src='/biztechlogo.png'
                      />
                    </div>
                    <nav className='flex flex-1 flex-col'>
                      <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                        <li>
                          <ul role='list' className='-mx-2 space-y-1'>
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? 'bg-gray-800 text-white'
                                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <item.icon
                                    className='h-6 w-6 shrink-0'
                                    aria-hidden='true'
                                  />
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className='text-xs font-semibold leading-6 text-gray-400'>
                            Your team
                          </div>
                          <ul role='list' className='-mx-2 mt-2 space-y-1'>
                            {teams.map((team) => (
                              <li key={team.name}>
                                <a
                                  href={team.href}
                                  className={classNames(
                                    team.current
                                      ? 'bg-gray-800 text-white'
                                      : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                  )}
                                >
                                  <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white'>
                                    {team.initial}
                                  </span>
                                  <span className='truncate'>{team.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className='-mx-6 mt-auto'>
                          <a
                            href='#'
                            className='flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800'
                          >
                            <img
                              className='h-8 w-8 rounded-full bg-gray-800'
                              src='https://media.licdn.com/dms/image/D5603AQFviDjG26DlRQ/profile-displayphoto-shrink_800_800/0/1689219654699?e=1700697600&v=beta&t=tZG3pJalB9vELrtZiepeP7CbR8Q829LDzYxWP3Qvx7M'
                              alt=''
                            />
                            <span className='sr-only'>Your profile</span>
                            <span aria-hidden='true'>
                              {user
                                ? `${user.firstName} ${user.lastName}`
                                : 'Loading...'}
                            </span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className='hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col'>
          <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5'>
            <div className='flex h-16 shrink-0 items-center'>
              <img className='h-12 w-auto mt-4' src='./biztechlogo.png' />
            </div>
            <nav className='flex flex-1 flex-col'>
              <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                <li>
                  <ul role='list' className='-mx-2 space-y-1'>
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon
                            className='h-6 w-6 shrink-0'
                            aria-hidden='true'
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className='text-xs font-semibold leading-6 text-gray-400'>
                    Your team
                  </div>
                  <ul role='list' className='-mx-2 mt-2 space-y-1'>
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:text-white hover:bg-gray-800',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white'>
                            {team.initial}
                          </span>
                          <span className='truncate'>{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className='-mx-6 mt-auto'>
                  <a
                    href='#'
                    className='flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800'
                  >
                    <img
                      className='h-8 w-8 rounded-full bg-gray-800'
                      src='https://media.licdn.com/dms/image/D5603AQFviDjG26DlRQ/profile-displayphoto-shrink_400_400/0/1689219654699?e=1700697600&v=beta&t=_-LRIlZ6Q_DUqLTa9MZC8uJ3YdmIFX2fS1JFNSuwwPQ'
                      alt=''
                    />
                    <span className='sr-only'>Your profile</span>
                    <span aria-hidden='true'>
                      {user
                        ? `${user.firstName} ${user.lastName}`
                        : 'Loading...'}
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className='xl:pl-72'>
          {/* Sticky search header */}
          <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8'>
            <button
              type='button'
              className='-m-2.5 p-2.5 text-white xl:hidden'
              onClick={() => setSidebarOpen(true)}
            >
              <span className='sr-only'>Open sidebar</span>
              <Bars3Icon className='h-5 w-5' aria-hidden='true' />
            </button>

            <div className='flex flex-1 gap-x-4 self-stretch lg:gap-x-6'></div>
          </div>

          <main className='lg:pr-96'>
            <header className='flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8'>
              <h1 className='text-base font-semibold leading-7 text-white'>
                Questions
              </h1>

              {/* Sort dropdown */}
              <Menu as='div' className='relative'>
                <Menu.Button className='flex items-center gap-x-1 text-sm font-medium leading-6 text-white'>
                  Sort by
                  <ChevronUpDownIcon
                    className='h-5 w-5 text-gray-500'
                    aria-hidden='true'
                  />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href='#'
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                          )}
                        >
                          Name
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href='#'
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                          )}
                        >
                          Date updated
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href='#'
                          className={classNames(
                            active ? 'bg-gray-50' : '',
                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                          )}
                        >
                          Environment
                        </a>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </header>

            {/* Questions list */}
            <ul role='list' className='divide-y divide-white/5'>
              {questions
                .sort((a, b) => b.timestamp.seconds - a.timestamp.seconds)
                .map((question) => (
                  <li
                    key={question.id}
                    className='relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8'
                  >
                    <div className='min-w-0 flex-auto'>
                      <div className='flex items-center gap-x-3'>
                        <div
                          className={classNames(
                            statuses[question.status],
                            'flex-none rounded-full p-1'
                          )}
                        >
                          <div className='h-2 w-2 rounded-full bg-current' />
                        </div>
                        <h2 className='min-w-0 text-sm font-semibold leading-6 text-white'>
                          <a href={question.href} className='flex gap-x-2'>
                            <span className='truncate'>
                              {question.teamName}
                            </span>
                            <span className='text-gray-400'>/</span>
                            <span className='whitespace-nowrap'>
                              {question.question}
                            </span>
                            <span className='absolute inset-0' />
                          </a>
                        </h2>
                      </div>
                      <div className='mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400'>
                        <p className='truncate'>{question.description}</p>
                        <svg
                          viewBox='0 0 2 2'
                          className='h-0.5 w-0.5 flex-none fill-gray-300'
                        >
                          <circle cx={1} cy={1} r={1} />
                        </svg>
                        <p className='whitespace-nowrap'>
                          {timeAgo(question.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className='rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset text-white'>
                      {question.category}
                    </div>
                    {/* <ChevronRightIcon
                    className='h-5 w-5 flex-none text-gray-400'
                    aria-hidden='true'
                  /> */}
                  </li>
                ))}
            </ul>
          </main>

          {/* Submit a question */}
          <aside className='bg-black/10 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5'>
            <header className='flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8'>
              <h2 className='text-base font-semibold leading-7 text-white'>
                Submit a Question{' '}
              </h2>
            </header>
            <div className='mx-8'>
              <div>
                <div className='mt-4'>
                  <label className='block text-sm font-medium leading-6 text-white'>
                    Question
                  </label>
                  <div className='mt-2'>
                    <input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className='px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      placeholder='How do I create a pull request?'
                    />
                  </div>
                  <p
                    className='mt-2 text-sm text-gray-400'
                    id='email-description'
                  >
                    What is your question?
                  </p>
                </div>

                <div className='mt-4'>
                  <label
                    htmlFor='location'
                    className='block text-sm font-medium leading-6 text-white'
                  >
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  >
                    <option>Front-end</option>
                    <option>Back-end</option>
                    <option>Databases & Storage</option>
                    <option>APIs</option>
                    <option>UI/UX</option>
                    <option>Ideation</option>
                    <option>Pitching</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className='mt-4'>
                  <label
                    htmlFor='comment'
                    className='block text-sm font-medium leading-6 text-white'
                  >
                    Description
                  </label>
                  <div className='mt-2 '>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      name='comment'
                      id='comment'
                      className='px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      placeholder="I'm trying to merge my incredible code but it's not working properly"
                    />
                  </div>
                </div>
              </div>
              <button
                type='button'
                onClick={submitQuestion}
                className='mt-8 rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
              >
                Submit your question!{' '}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}