import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Users, X, ExternalLink, Edit2 } from 'lucide-react';
import Slider from 'react-slick';
import { ProjectCard } from './ProjectCard';
import { CardButtons } from './CardButtons';
import { EditableContent } from './cms/EditableContent';
import { EditableCollection, EditModal, type FieldSchema } from './cms/EditableCollection';
import { useCMS } from '../context/CMSContext';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

const talks = [
  {
    id: 1,
    title: "Ethical AI in Healthcare",
    date: "Feb 12, 2026",
    time: "6:00 PM - 7:30 PM EST",
    location: "IFT Auditorium, Building 32",
    speaker: "Dr. Sarah Chen",
    role: "AI Ethics Researcher",
    organization: "MIT Media Lab",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Exploring the ethical implications of artificial intelligence in healthcare systems, from diagnostic algorithms to patient data privacy. This talk examines real-world case studies and proposes frameworks for responsible AI deployment in medical contexts.",
    tags: ["AI Ethics", "Healthcare", "Policy"]
  },
  {
    id: 2,
    title: "Quantum Computing Futures",
    date: "Jan 28, 2026",
    time: "5:30 PM - 7:00 PM EST",
    location: "Virtual Event",
    speaker: "Prof. James Wilson",
    role: "Quantum Physicist",
    organization: "Stanford Quantum Computing Lab",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "A deep dive into the current state and future potential of quantum computing. We'll explore recent breakthroughs, practical applications, and the timeline for quantum advantage in real-world problems.",
    tags: ["Quantum", "Computing", "Future Tech"]
  },
  {
    id: 3,
    title: "Generative Art & Society",
    date: "Dec 15, 2025",
    time: "7:00 PM - 8:30 PM EST",
    location: "IFT Gallery Space",
    speaker: "Maya Rodriguez",
    role: "Digital Artist",
    organization: "Creative AI Collective",
    image: "https://images.unsplash.com/photo-1764874299006-bf4266427ec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "An artist's perspective on generative AI and its impact on creative practice and society. This talk explores the tension between human creativity and machine-generated art, featuring live demonstrations and interactive discussions.",
    tags: ["Generative AI", "Art", "Society"]
  },
  {
    id: 4,
    title: "Brain-Computer Interfaces",
    date: "Nov 22, 2025",
    time: "6:30 PM - 8:00 PM EST",
    location: "IFT Auditorium, Building 32",
    speaker: "Dr. Alex Kim",
    role: "Neuroscientist",
    organization: "CalTech Brain Lab",
    image: "https://images.unsplash.com/photo-1559757175-5e8f0c8e5e6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Discover the latest advances in brain-computer interface technology and its potential to revolutionize accessibility and human augmentation.",
    tags: ["BCI", "Neuroscience", "Accessibility"]
  },
  {
    id: 5,
    title: "Climate Tech Innovation",
    date: "Oct 18, 2025",
    time: "5:00 PM - 6:30 PM EST",
    location: "Virtual Event",
    speaker: "Dr. Rachel Green",
    role: "Climate Scientist",
    organization: "Climate Solutions Lab",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Exploring technological solutions to climate change, from carbon capture to renewable energy innovation and sustainable computing.",
    tags: ["Climate", "Sustainability", "Innovation"]
  },
  {
    id: 6,
    title: "The Future of Work",
    date: "Sep 30, 2025",
    time: "7:00 PM - 8:30 PM EST",
    location: "IFT Conference Hall",
    speaker: "Prof. David Park",
    role: "Sociologist",
    organization: "Harvard Future of Work Institute",
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "How automation, AI, and remote work are reshaping employment, productivity, and human collaboration in the 21st century.",
    tags: ["Future of Work", "AI", "Society"]
  },
  {
    id: 7,
    title: "Synthetic Biology & Design",
    date: "Aug 25, 2025",
    time: "6:00 PM - 7:30 PM EST",
    location: "IFT Bio Lab",
    speaker: "Dr. Maria Santos",
    role: "Synthetic Biologist",
    organization: "Bio-Design Institute",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Engineering living systems for art, medicine, and environmental restoration. Exploring the intersection of biology and design thinking.",
    tags: ["Synthetic Biology", "Bio-Design", "Art"]
  },
  {
    id: 8,
    title: "Web3 & Decentralization",
    date: "Jul 15, 2025",
    time: "5:30 PM - 7:00 PM EST",
    location: "Virtual Event",
    speaker: "Jordan Lee",
    role: "Blockchain Developer",
    organization: "Decentralized Future Foundation",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Understanding blockchain, cryptocurrency, and decentralized systems beyond the hype. Practical applications and future possibilities.",
    tags: ["Web3", "Blockchain", "Decentralization"]
  }
];

const festivals = [
  {
    id: 1,
    year: "2025",
    theme: "Symbiosis",
    date: "March 15-17, 2026",
    location: "IFT Campus & Virtual",
    image: "https://images.unsplash.com/photo-1667054788090-b1c950427685?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Our annual festival exploring the symbiotic relationship between humans, technology, and nature. Join us for three days of installations, performances, workshops, and keynotes that reimagine our interconnected future.",
    highlights: ["Interactive Bio-Art Installations", "50+ Workshop Sessions", "International Keynote Speakers", "Virtual Reality Experiences"],
    tags: ["Festival", "Art", "Technology"]
  },
  {
    id: 2,
    year: "2024",
    theme: "Emergence",
    date: "April 20-22, 2025",
    location: "IFT Campus",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Celebrating emergent properties in complex systems, from swarm robotics to generative AI. This festival brought together artists, researchers, and technologists to explore how simple rules create complex behaviors.",
    highlights: ["Swarm Robotics Demonstrations", "Generative Art Gallery", "Live Coding Performances", "Research Poster Sessions"],
    tags: ["Festival", "Emergence", "Systems"]
  },
  {
    id: 3,
    year: "2023",
    theme: "Origins",
    date: "May 10-12, 2024",
    location: "IFT Campus",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "A retrospective journey through the history of computing and its cultural impact. Our inaugural festival examined the roots of digital culture and speculated on future trajectories.",
    highlights: ["Historical Computing Exhibition", "Vintage Hardware Showcase", "Digital Archaeology Workshop", "Future Visions Panel"],
    tags: ["Festival", "History", "Culture"]
  },
  {
    id: 4,
    year: "2022",
    theme: "Convergence",
    date: "June 8-10, 2023",
    location: "IFT Campus",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Exploring the convergence of disciplines at the intersection of art, science, and technology. A celebration of interdisciplinary collaboration.",
    highlights: ["Cross-Disciplinary Workshops", "Art-Science Installations", "Collaborative Projects Showcase", "Panel Discussions"],
    tags: ["Festival", "Interdisciplinary", "Collaboration"]
  },
  {
    id: 5,
    year: "2021",
    theme: "Futures",
    date: "July 15-17, 2022",
    location: "Virtual Event",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Speculating on multiple possible futures through immersive experiences, workshops, and performances that challenge our assumptions about tomorrow.",
    highlights: ["Future Scenarios Workshop", "Speculative Design Exhibition", "Virtual Reality Futures", "AI-Generated Art"],
    tags: ["Festival", "Speculation", "Futures"]
  }
];

const misc = [
  {
    id: 1,
    title: "HackMIT 2025 Winner",
    category: "Award",
    date: "September 2025",
    image: "https://images.unsplash.com/photo-1580232494717-d985340cb739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Our team won first place at HackMIT 2025 with 'NeuroSync', an AI-powered brain-computer interface for accessibility. The project enables users with motor disabilities to control devices using thought patterns.",
    award: "Grand Prize - $10,000",
    team: ["Alex Kim", "Jordan Lee", "Sam Patel"],
    tags: ["Hackathon", "BCI", "Accessibility"]
  },
  {
    id: 2,
    title: "Wired Magazine Feature",
    category: "Press",
    date: "August 2025",
    image: "https://images.unsplash.com/photo-1722684768315-11fc753354f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "IFT's bio-hybrid interface research was featured in Wired's 'The Future of Human-Computer Interaction' cover story. The article explores how our work with living materials is reshaping interface design.",
    publication: "Wired Magazine, Issue #33.08",
    author: "Emily Chen",
    tags: ["Press", "Bio-Hybrid", "HCI"]
  },
  {
    id: 3,
    title: "Laval Virtual Award",
    category: "Award",
    date: "April 2025",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Received the Innovation Award at Laval Virtual 2025 for our haptic data physicalization research. The jury recognized the project's potential to make data accessible through tactile experiences.",
    award: "Innovation Award",
    team: ["Dr. Lisa Badr", "Prof. Antoine Prouzeau"],
    tags: ["VR", "Haptics", "Innovation"]
  },
  {
    id: 4,
    title: "TechCrunch Spotlight",
    category: "Press",
    date: "March 2025",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Featured in TechCrunch's 'Innovators to Watch' series for our work on sustainable computing and green AI initiatives.",
    publication: "TechCrunch",
    author: "Sarah Johnson",
    tags: ["Press", "Green AI", "Innovation"]
  },
  {
    id: 5,
    title: "ACM CHI Best Paper",
    category: "Award",
    date: "May 2024",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Our research on haptic feedback in virtual environments received the Best Paper Award at ACM CHI 2024.",
    award: "Best Paper Award",
    team: ["Dr. Sarah Chen", "Prof. Marc Teyssier"],
    tags: ["Award", "CHI", "Research"]
  },
  {
    id: 6,
    title: "Nature Article Feature",
    category: "Press",
    date: "January 2024",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Our climate tech research was highlighted in Nature's special issue on technological solutions to environmental challenges.",
    publication: "Nature, Vol. 615",
    author: "Dr. Robert Wilson",
    tags: ["Press", "Climate", "Research"]
  },
  {
    id: 7,
    title: "SIGGRAPH Technical Achievement",
    category: "Award",
    date: "August 2023",
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Honored with the Technical Achievement Award for our neural rendering work in real-time graphics.",
    award: "Technical Achievement Award",
    team: ["Dr. Kevin Lee", "Anna Schmidt"],
    tags: ["Award", "SIGGRAPH", "Graphics"]
  },
  {
    id: 8,
    title: "MIT Technology Review",
    category: "Press",
    date: "November 2023",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    description: "Named in MIT Technology Review's '35 Innovators Under 35' for breakthroughs in human-computer interaction.",
    publication: "MIT Technology Review",
    author: "Editorial Board",
    tags: ["Press", "Innovation", "Recognition"]
  }
];

// Helper to normalize array-or-comma-separated-string to string[]
const toArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter(Boolean).map(String) : (typeof v === 'string' ? (v || '').split(',').map(s => s.trim()).filter(Boolean) : []);

// Pick first non-empty string from values (handles undefined, null, empty string)
const firstFilled = (...vals: (string | undefined | null)[]): string => {
  const v = vals.find(x => x != null && String(x).trim() !== '');
  return v != null ? String(v).trim() : '';
};

// Placeholder image for events without one
const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

// Custom Arrow Components
const CustomArrow = ({ onClick, direction }: { onClick?: () => void; direction: 'prev' | 'next' }) => (
  direction === 'prev' ? (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-20 w-10 h-10 flex items-center justify-center bg-neutral-900 hover:bg-teal-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      <ChevronLeft className="w-5 h-5" />
    </button>
  ) : (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-20 w-10 h-10 flex items-center justify-center bg-neutral-900 hover:bg-teal-600 text-white rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      <ChevronRight className="w-5 h-5" />
    </button>
  )
);

const talksSchema: FieldSchema[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'date', label: 'Date', type: 'text' },
  { key: 'time', label: 'Time', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'speaker', label: 'Speaker', type: 'text' },
  { key: 'role', label: 'Speaker Role', type: 'text' },
  { key: 'organization', label: 'Organization', type: 'text' },
  { key: 'image', label: 'Image', type: 'image' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
  { key: 'button1_show', label: 'Show button 1', type: 'toggle' },
  { key: 'button1_label', label: 'Button 1 - Text', type: 'text', showWhen: 'button1_show' },
  { key: 'button1_url', label: 'Button 1 - URL', type: 'text', showWhen: 'button1_show' },
  { key: 'button2_show', label: 'Show button 2', type: 'toggle' },
  { key: 'button2_label', label: 'Button 2 - Text', type: 'text', showWhen: 'button2_show' },
  { key: 'button2_url', label: 'Button 2 - URL', type: 'text', showWhen: 'button2_show' },
];
const festivalsSchema: FieldSchema[] = [
  { key: 'theme', label: 'Theme', type: 'text' },
  { key: 'year', label: 'Year', type: 'text' },
  { key: 'date', label: 'Date', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'image', label: 'Image', type: 'image' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'highlights', label: 'Highlights (comma separated)', type: 'text' },
  { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
  { key: 'button1_show', label: 'Show button 1', type: 'toggle' },
  { key: 'button1_label', label: 'Button 1 - Text', type: 'text', showWhen: 'button1_show' },
  { key: 'button1_url', label: 'Button 1 - URL', type: 'text', showWhen: 'button1_show' },
  { key: 'button2_show', label: 'Show button 2', type: 'toggle' },
  { key: 'button2_label', label: 'Button 2 - Text', type: 'text', showWhen: 'button2_show' },
  { key: 'button2_url', label: 'Button 2 - URL', type: 'text', showWhen: 'button2_show' },
];
const miscSchema: FieldSchema[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'category', label: 'Category', type: 'select', options: ['Award', 'Press'] },
  { key: 'date', label: 'Date', type: 'text' },
  { key: 'image', label: 'Image', type: 'image' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'award', label: 'Award (if applicable)', type: 'text' },
  { key: 'team', label: 'Team (comma separated)', type: 'text' },
  { key: 'publication', label: 'Publication (if press)', type: 'text' },
  { key: 'author', label: 'Author (if press)', type: 'text' },
  { key: 'tags', label: 'Tags (comma separated)', type: 'text' },
  { key: 'button1_show', label: 'Show button 1', type: 'toggle' },
  { key: 'button1_label', label: 'Button 1 - Text', type: 'text', showWhen: 'button1_show' },
  { key: 'button1_url', label: 'Button 1 - URL', type: 'text', showWhen: 'button1_show' },
  { key: 'button2_show', label: 'Show button 2', type: 'toggle' },
  { key: 'button2_label', label: 'Button 2 - Text', type: 'text', showWhen: 'button2_show' },
  { key: 'button2_url', label: 'Button 2 - URL', type: 'text', showWhen: 'button2_show' },
];

export const Events = () => {
  const { getContent, updateContent, isEditing, canEditKey } = useCMS();
  const allTalks = getContent('events-talks', talks) as typeof talks;
  const allFestivals = getContent('events-festivals', festivals) as typeof festivals;
  const allMisc = getContent('events-misc', misc) as typeof misc;
  const visibleTalks = isEditing ? allTalks : (Array.isArray(allTalks) ? allTalks : []).filter((i: any) => !i.hidden);
  const visibleFestivals = isEditing ? allFestivals : (Array.isArray(allFestivals) ? allFestivals : []).filter((i: any) => !i.hidden);
  const visibleMisc = isEditing ? allMisc : (Array.isArray(allMisc) ? allMisc : []).filter((i: any) => !i.hidden);
  const [viewingTalk, setViewingTalk] = React.useState<typeof talks[0] | null>(null);
  const [viewingFestival, setViewingFestival] = React.useState<typeof festivals[0] | null>(null);
  const [viewingMisc, setViewingMisc] = React.useState<typeof misc[0] | null>(null);
  const [editingTalkInModal, setEditingTalkInModal] = React.useState(false);
  const [editingFestivalInModal, setEditingFestivalInModal] = React.useState(false);
  const [editingMiscInModal, setEditingMiscInModal] = React.useState(false);
  const canEditTalks = isEditing && canEditKey('events-talks');
  const canEditFestivals = isEditing && canEditKey('events-festivals');
  const canEditMisc = isEditing && canEditKey('events-misc');
  const talksSliderRef = React.useRef<Slider | null>(null);

  const findItemIndex = (list: any[], item: any) =>
    list.findIndex((p: any) => (p.id && item.id && p.id === item.id) || p === item);

  const handleSaveTalkEdit = (updated: any) => {
    if (!viewingTalk) return;
    const list = [...(Array.isArray(allTalks) ? allTalks : [])];
    const idx = findItemIndex(list, viewingTalk);
    if (idx === -1) return;
    list[idx] = { ...viewingTalk, ...updated };
    updateContent('events-talks', list);
    setViewingTalk(list[idx]);
    setEditingTalkInModal(false);
  };
  const handleSaveFestivalEdit = (updated: any) => {
    if (!viewingFestival) return;
    const list = [...(Array.isArray(allFestivals) ? allFestivals : [])];
    const idx = findItemIndex(list, viewingFestival);
    if (idx === -1) return;
    list[idx] = { ...viewingFestival, ...updated };
    updateContent('events-festivals', list);
    setViewingFestival(list[idx]);
    setEditingFestivalInModal(false);
  };
  const handleSaveMiscEdit = (updated: any) => {
    if (!viewingMisc) return;
    const list = [...(Array.isArray(allMisc) ? allMisc : [])];
    const idx = findItemIndex(list, viewingMisc);
    if (idx === -1) return;
    list[idx] = { ...viewingMisc, ...updated };
    updateContent('events-misc', list);
    setViewingMisc(list[idx]);
    setEditingMiscInModal(false);
  };
  const festivalsSliderRef = React.useRef<Slider | null>(null);
  const miscSliderRef = React.useRef<Slider | null>(null);
  const talksLastWheelAtRef = React.useRef(0);
  const festivalsLastWheelAtRef = React.useRef(0);
  const miscLastWheelAtRef = React.useRef(0);

  const createTrackpadWheelHandler = React.useCallback(
    (sliderRef: React.RefObject<Slider | null>, lastWheelAtRef: React.MutableRefObject<number | null>) =>
      (event: React.WheelEvent<HTMLDivElement>) => {
        const deltaX = event.deltaX;
        const deltaY = event.deltaY;
        const dominantDelta = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

        if (Math.abs(dominantDelta) < 15) return;

        const now = Date.now();
        if (now - (lastWheelAtRef.current ?? 0) < 250) return;
        lastWheelAtRef.current = now;

        event.preventDefault();
        if (dominantDelta > 0) {
          sliderRef.current?.slickNext();
        }
      },
    [],
  );

  useBodyScrollLock(!!viewingTalk || !!viewingFestival || !!viewingMisc);

  // Carousel settings — mobile: full-width cards + dots; desktop: multi-column
  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    prevArrow: <CustomArrow direction="prev" />,
    nextArrow: <CustomArrow direction="next" />,
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: false,
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          dots: false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
        }
      }
    ]
  };

  const talksSettings = sliderSettings;
  const festivalsSettings = sliderSettings;
  const miscSettings = sliderSettings;

  return (
    <section className="bg-white min-h-screen text-neutral-900 pt-16 md:pt-20 lg:pt-24 pb-24 font-sans relative overflow-x-hidden">

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 xl:px-20 relative z-10 overflow-x-hidden">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-neutral-900 leading-[0.9] uppercase"
            role="heading"
            aria-level={1}
          >
            <EditableContent
              id="events-title"
              defaultContent="Events"
              enableProse={false}
              multiline={false}
              className="[&_p]:m-0"
            />
          </motion.div>
          <div className="text-lg md:text-xl text-neutral-500 font-serif italic mb-12 max-w-xl leading-relaxed">
            <EditableContent
              id="events-intro"
              defaultContent="Join us for talks, festivals, and celebrations at the intersection of technology, art, and innovation."
              enableProse={false}
              className="[&_p]:m-0"
            />
          </div>
        </motion.div>

        {/* SECTION 1: TALKS */}
        <div className="mb-32">
           <div className="text-2xl md:text-4xl font-mono tracking-widest uppercase text-neutral-400 mb-8" role="heading" aria-level={2}>
             <EditableContent
               id="events-section1-title"
               defaultContent="01 / Instant Future Talks"
               enableProse={false}
               multiline={false}
               className="[&_p]:m-0"
             />
           </div>

           {isEditing ? (
             <EditableCollection
               id="events-talks"
               defaultData={talks}
               containerClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
               schema={talksSchema}
               renderItem={(talk: any, index: number) => (
                 <ProjectCard
                   title={talk.title || 'Untitled'}
                   subtitle={firstFilled(talk.date, talk.time, talk.location, talk.speaker)}
                   image={talk.image || PLACEHOLDER_IMAGE}
                   aspectRatio="square"
                   variant="geometric"
                   index={index}
                   onClick={() => setViewingTalk(talk)}
                 />
               )}
             />
           ) : (
             <>
               {/* Mobile: vertical stack (matches edit mode) */}
               <div className="grid grid-cols-1 gap-4 md:hidden">
                 {visibleTalks.map((talk, index) => (
                   <ProjectCard
                     key={talk.id}
                     title={talk.title || 'Untitled'}
                     subtitle={firstFilled(talk.date, talk.time, talk.location, talk.speaker)}
                     image={talk.image || PLACEHOLDER_IMAGE}
                     aspectRatio="square"
                     variant="geometric"
                     index={index}
                     onClick={() => setViewingTalk(talk)}
                   />
                 ))}
               </div>
               {/* Desktop: carousel */}
               <div className="hidden md:block relative" onWheel={createTrackpadWheelHandler(talksSliderRef, talksLastWheelAtRef)}>
                 <Slider ref={talksSliderRef} {...talksSettings}>
                   {visibleTalks.map((talk, index) => (
                     <div key={talk.id} className="px-3">
                       <ProjectCard
                         title={talk.title || 'Untitled'}
                         subtitle={firstFilled(talk.date, talk.time, talk.location, talk.speaker)}
                         image={talk.image || PLACEHOLDER_IMAGE}
                         aspectRatio="square"
                         variant="geometric"
                         index={index}
                         onClick={() => setViewingTalk(talk)}
                       />
                     </div>
                   ))}
                 </Slider>
               </div>
             </>
           )}
        </div>

        {/* SECTION 2: FESTIVALS */}
        <div className="mb-32">
           <div className="text-2xl md:text-4xl font-mono tracking-widest uppercase text-neutral-400 mb-8" role="heading" aria-level={2}>
             <EditableContent
               id="events-section2-title"
               defaultContent="02 / Trailblazer Talks"
               enableProse={false}
               multiline={false}
               className="[&_p]:m-0"
             />
           </div>

           {isEditing ? (
             <EditableCollection
               id="events-festivals"
               defaultData={festivals}
               containerClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
               schema={festivalsSchema}
               renderItem={(fest: any, index: number) => (
                 <ProjectCard
                   title={fest.theme || 'Untitled'}
                   subtitle={firstFilled(fest.year, fest.date, fest.location)}
                   image={fest.image || PLACEHOLDER_IMAGE}
                   aspectRatio="square"
                   variant="geometric"
                   index={index}
                   onClick={() => setViewingFestival(fest)}
                 />
               )}
             />
           ) : (
             <>
               {/* Mobile: vertical stack (matches edit mode) */}
               <div className="grid grid-cols-1 gap-4 md:hidden">
                 {visibleFestivals.map((fest, index) => (
                   <ProjectCard
                     key={fest.id ?? fest.year}
                     title={fest.theme || 'Untitled'}
                     subtitle={firstFilled(fest.year, fest.date, fest.location)}
                     image={fest.image || PLACEHOLDER_IMAGE}
                     aspectRatio="square"
                     variant="geometric"
                     index={index}
                     onClick={() => setViewingFestival(fest)}
                   />
                 ))}
               </div>
               {/* Desktop: carousel */}
               <div className="hidden md:block relative" onWheel={createTrackpadWheelHandler(festivalsSliderRef, festivalsLastWheelAtRef)}>
                 <Slider ref={festivalsSliderRef} {...festivalsSettings}>
                   {visibleFestivals.map((fest, index) => (
                     <div key={fest.id ?? fest.year} className="px-3">
                       <ProjectCard
                         title={fest.theme || 'Untitled'}
                         subtitle={firstFilled(fest.year, fest.date, fest.location)}
                         image={fest.image || PLACEHOLDER_IMAGE}
                         aspectRatio="square"
                         variant="geometric"
                         index={index}
                         onClick={() => setViewingFestival(fest)}
                       />
                     </div>
                   ))}
                 </Slider>
               </div>
             </>
           )}
        </div>

        {/* SECTION 3: MISC */}
        <div className="mb-12">
           <div className="text-2xl md:text-4xl font-mono tracking-widest uppercase text-neutral-400 mb-8" role="heading" aria-level={2}>
             <EditableContent
               id="events-section3-title"
               defaultContent="03 / De Vinci Festival"
               enableProse={false}
               multiline={false}
               className="[&_p]:m-0"
             />
           </div>

           {isEditing ? (
             <EditableCollection
               id="events-misc"
               defaultData={misc}
               containerClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
               schema={miscSchema}
               renderItem={(item: any, index: number) => (
                 <ProjectCard
                   title={item.title || 'Untitled'}
                   subtitle={firstFilled(item.category, item.date)}
                   image={item.image || PLACEHOLDER_IMAGE}
                   aspectRatio="square"
                   variant="geometric"
                   accentColor="text-white"
                   index={index}
                   onClick={() => setViewingMisc(item)}
                 />
               )}
             />
           ) : (
             <>
               {/* Mobile: vertical stack (matches edit mode) */}
               <div className="grid grid-cols-1 gap-4 md:hidden">
                 {visibleMisc.map((item, index) => (
                   <ProjectCard
                     key={item.id}
                     title={item.title || 'Untitled'}
                     subtitle={firstFilled(item.category, item.date)}
                     image={item.image || PLACEHOLDER_IMAGE}
                     aspectRatio="square"
                     variant="geometric"
                     accentColor="text-white"
                     index={index}
                     onClick={() => setViewingMisc(item)}
                   />
                 ))}
               </div>
               {/* Desktop: carousel */}
               <div className="hidden md:block relative" onWheel={createTrackpadWheelHandler(miscSliderRef, miscLastWheelAtRef)}>
                 <Slider ref={miscSliderRef} {...miscSettings}>
                   {visibleMisc.map((item, index) => (
                     <div key={item.id} className="px-3">
                       <ProjectCard
                         title={item.title || 'Untitled'}
                         subtitle={firstFilled(item.category, item.date)}
                         image={item.image || PLACEHOLDER_IMAGE}
                         aspectRatio="square"
                         variant="geometric"
                         accentColor="text-white"
                         index={index}
                         onClick={() => setViewingMisc(item)}
                       />
                     </div>
                   ))}
                 </Slider>
               </div>
             </>
           )}
        </div>
      </div>

      {/* Modal for Talk Details */}
      <AnimatePresence>
        {viewingTalk && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingTalk(null)}
              onTouchMove={(e) => e.preventDefault()}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm touch-none"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                {canEditTalks && (
                  <button onClick={() => setEditingTalkInModal(true)} className="p-2 bg-teal-100 hover:bg-teal-200 rounded-full transition-colors text-teal-700" title="Edit event">
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
                <button onClick={() => { setViewingTalk(null); setEditingTalkInModal(false); }} className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors">
                  <X className="w-6 h-6 text-neutral-900" />
                </button>
              </div>

              <div className="max-h-[90vh] overflow-y-auto md:overflow-hidden modal-scroll flex flex-col md:flex-row">
              {/* Media Section - Left Side */}
              <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-auto bg-neutral-100 relative flex-shrink-0">
                <img 
                  src={viewingTalk.image || PLACEHOLDER_IMAGE} 
                  alt={viewingTalk.title || 'Event'} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-xs font-mono uppercase tracking-wider border border-neutral-100">
                  Discovery Talk
                </div>
              </div>

              {/* Content Section - Right Side */}
              <div className="flex-grow p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                  <div className="mb-6">
                  {toArray(viewingTalk.tags).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {toArray(viewingTalk.tags).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-teal-50 text-teal-700 text-[10px] uppercase tracking-wider border border-teal-100 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4 leading-tight">
                    {viewingTalk.title || 'Untitled'}
                  </h2>
                  
                  {(viewingTalk.speaker || viewingTalk.role || viewingTalk.organization || viewingTalk.date || viewingTalk.time || viewingTalk.location) && (
                    <div className="flex flex-col gap-2 mb-8 border-l-2 border-teal-500 pl-4 py-1">
                      {(viewingTalk.speaker || viewingTalk.role || viewingTalk.organization) && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Users className="w-4 h-4 text-teal-600" />
                          {viewingTalk.speaker && <span className="font-bold text-neutral-900">{viewingTalk.speaker}</span>}
                          {viewingTalk.speaker && (viewingTalk.role || viewingTalk.organization) && <span className="text-neutral-400">•</span>}
                          {(viewingTalk.role || viewingTalk.organization) && <span>{[viewingTalk.role, viewingTalk.organization].filter(Boolean).join(', ')}</span>}
                        </div>
                      )}
                      {(viewingTalk.date || viewingTalk.time) && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 font-mono">
                          <Calendar className="w-4 h-4 text-teal-600" />
                          <span>{[viewingTalk.date, viewingTalk.time].filter(Boolean).join(' • ')}</span>
                        </div>
                      )}
                      {viewingTalk.location && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 font-mono">
                          <MapPin className="w-4 h-4 text-teal-600" />
                          <span>{viewingTalk.location}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {viewingTalk.description && (
                    <div className="prose prose-neutral prose-sm max-w-none mb-8">
                      <p className="text-neutral-600 leading-relaxed text-base">
                        {viewingTalk.description}
                      </p>
                      {(viewingTalk.speaker || viewingTalk.organization) && (
                        <p className="text-neutral-600 leading-relaxed text-base mt-4">
                          Join us for an engaging discussion{viewingTalk.speaker ? ` with ${viewingTalk.speaker}` : ''}{viewingTalk.organization ? ` from ${viewingTalk.organization}` : ''}. 
                          This talk is part of our Discovery Talks series, bringing together leading researchers and practitioners 
                          to share cutting-edge insights and foster meaningful dialogue.
                        </p>
                      )}
                    </div>
                  )}
                  </div>

                <CardButtons
                  item={viewingTalk}
                  defaultButtons={[
                    { label: 'Register', primary: true },
                    { label: 'Add to Calendar', primary: false },
                  ]}
                />
                </div>
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal for Festival Details */}
      <AnimatePresence>
        {viewingFestival && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingFestival(null)}
              onTouchMove={(e) => e.preventDefault()}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm touch-none"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                {canEditFestivals && (
                  <button onClick={() => setEditingFestivalInModal(true)} className="p-2 bg-teal-100 hover:bg-teal-200 rounded-full transition-colors text-teal-700" title="Edit festival">
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
                <button onClick={() => { setViewingFestival(null); setEditingFestivalInModal(false); }} className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors">
                  <X className="w-6 h-6 text-neutral-900" />
                </button>
              </div>

              <div className="max-h-[90vh] overflow-y-auto md:overflow-hidden modal-scroll flex flex-col md:flex-row">
              {/* Media Section - Left Side */}
              <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-auto bg-neutral-100 relative flex-shrink-0">
                <img 
                  src={viewingFestival.image || PLACEHOLDER_IMAGE} 
                  alt={viewingFestival.theme || 'Festival'} 
                  className="w-full h-full object-cover"
                />
                {(viewingFestival.year || viewingFestival.theme) && (
                  <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-xs font-mono uppercase tracking-wider border border-neutral-100">
                    {viewingFestival.year ? `IFT Festival ${viewingFestival.year}` : (viewingFestival.theme || 'Festival')}
                  </div>
                )}
              </div>

              {/* Content Section - Right Side */}
              <div className="flex-grow p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                  {toArray(viewingFestival.tags).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {toArray(viewingFestival.tags).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-teal-50 text-teal-700 text-[10px] uppercase tracking-wider border border-teal-100 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4 leading-tight">
                    {viewingFestival.theme || 'Untitled'}
                  </h2>
                  
                  {(viewingFestival.date || viewingFestival.location) && (
                    <div className="flex flex-col gap-2 mb-8 border-l-2 border-teal-500 pl-4 py-1">
                      {viewingFestival.date && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 font-mono">
                          <Calendar className="w-4 h-4 text-teal-600" />
                          <span>{viewingFestival.date}</span>
                        </div>
                      )}
                      {viewingFestival.location && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 font-mono">
                          <MapPin className="w-4 h-4 text-teal-600" />
                          <span>{viewingFestival.location}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {viewingFestival.description && (
                    <div className="prose prose-neutral prose-sm max-w-none mb-8">
                      <p className="text-neutral-600 leading-relaxed text-base">
                        {viewingFestival.description}
                      </p>
                    </div>
                  )}
                  
                  {toArray(viewingFestival.highlights).length > 0 && (
                    <>
                      <h3 className="text-lg font-bold text-neutral-900 mt-6 mb-3">Festival Highlights</h3>
                      <ul className="space-y-2">
                        {toArray(viewingFestival.highlights).map((highlight: string, i: number) => (
                          <li key={i} className="text-neutral-600 text-base">{highlight}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <CardButtons
                  item={viewingFestival}
                  defaultButtons={[
                    { label: 'Learn More', primary: true },
                    { label: 'Save the Date', primary: false },
                  ]}
                />
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal for Award/Press Details */}
      <AnimatePresence>
        {viewingMisc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingMisc(null)}
              onTouchMove={(e) => e.preventDefault()}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm touch-none"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                {canEditMisc && (
                  <button onClick={() => setEditingMiscInModal(true)} className="p-2 bg-teal-100 hover:bg-teal-200 rounded-full transition-colors text-teal-700" title="Edit event">
                    <Edit2 className="w-5 h-5" />
                  </button>
                )}
                <button onClick={() => { setViewingMisc(null); setEditingMiscInModal(false); }} className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors">
                  <X className="w-6 h-6 text-neutral-900" />
                </button>
              </div>

              <div className="max-h-[90vh] overflow-y-auto md:overflow-hidden modal-scroll flex flex-col md:flex-row">
              {/* Media Section - Left Side */}
              <div className="w-full md:w-1/2 aspect-video md:aspect-auto md:h-auto bg-neutral-100 relative flex-shrink-0">
                <img 
                  src={viewingMisc.image || PLACEHOLDER_IMAGE} 
                  alt={viewingMisc.title || 'Event'} 
                  className="w-full h-full object-cover"
                />
                {viewingMisc.category && (
                  <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-xs font-mono uppercase tracking-wider border border-neutral-100">
                    {viewingMisc.category}
                  </div>
                )}
              </div>

              {/* Content Section - Right Side */}
              <div className="flex-grow p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col min-h-0">
                <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                  {toArray(viewingMisc.tags).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {toArray(viewingMisc.tags).map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-teal-50 text-teal-700 text-[10px] uppercase tracking-wider border border-teal-100 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4 leading-tight">
                    {viewingMisc.title || 'Untitled'}
                  </h2>
                  
                  {(viewingMisc.date || viewingMisc.award || viewingMisc.publication) && (
                    <div className="flex flex-col gap-2 mb-8 border-l-2 border-teal-500 pl-4 py-1">
                      {viewingMisc.date && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600 font-mono">
                          <Calendar className="w-4 h-4 text-teal-600" />
                          <span>{viewingMisc.date}</span>
                        </div>
                      )}
                      {viewingMisc.award && (
                        <div className="text-sm font-bold text-teal-600">
                          {viewingMisc.award}
                        </div>
                      )}
                      {viewingMisc.publication && (
                        <div className="text-sm text-neutral-600">
                          {viewingMisc.publication}
                        </div>
                      )}
                    </div>
                  )}

                  {viewingMisc.description && (
                    <div className="prose prose-neutral prose-sm max-w-none mb-8">
                      <p className="text-neutral-600 leading-relaxed text-base">
                        {viewingMisc.description}
                      </p>
                    </div>
                  )}
                  
                  {toArray(viewingMisc.team).length > 0 && (
                    <>
                      <h3 className="text-lg font-bold text-neutral-900 mt-6 mb-3">Team Members</h3>
                      <div className="flex flex-wrap gap-2">
                        {toArray(viewingMisc.team).map((member: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full">
                            {member}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {viewingMisc.author && (
                    <div className="mt-4 text-sm text-neutral-500">
                      Written by {viewingMisc.author}
                    </div>
                  )}
                </div>

                <CardButtons
                  item={viewingMisc}
                  defaultButtons={[
                    { label: viewingMisc.category === 'Press' ? 'Read Article' : 'View Details', primary: true },
                    { label: 'Share', primary: false },
                  ]}
                />
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <EditModal isOpen={editingTalkInModal} onClose={() => setEditingTalkInModal(false)} onSave={handleSaveTalkEdit} data={viewingTalk || {}} schema={talksSchema} title="Edit Talk" />
      <EditModal isOpen={editingFestivalInModal} onClose={() => setEditingFestivalInModal(false)} onSave={handleSaveFestivalEdit} data={viewingFestival || {}} schema={festivalsSchema} title="Edit Festival" />
      <EditModal isOpen={editingMiscInModal} onClose={() => setEditingMiscInModal(false)} onSave={handleSaveMiscEdit} data={viewingMisc || {}} schema={miscSchema} title="Edit Event" />
    </section>
  );
};