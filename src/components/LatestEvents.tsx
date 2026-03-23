import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ArrowRight, X } from 'lucide-react';
import { EditableCollection } from './cms/EditableCollection';
import { EditableContent } from './cms/EditableContent';
import { CardButtons } from './CardButtons';
import { EditableLink } from './cms/EditableLink';

type EventItem = {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  image: string;
  video: string;
};

const events: EventItem[] = [
  {
    id: 'e1',
    title: 'De Vinci Festival',
    type: 'flagship',
    date: 'March 15-17, 2025',
    location: 'Paris Campus',
    image: 'https://images.unsplash.com/photo-1732026261224-c55266116bc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    video: ''
  },
  {
    id: 'e2',
    title: 'Trailblazer Chat',
    type: 'internal',
    date: 'Fridays 14:00',
    location: 'Paris Campus',
    image: 'https://images.unsplash.com/photo-1542325488573-a28b3cd3c91d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    video: ''
  },
  {
    id: 'e4',
    title: 'Instant Future Talks',
    type: 'weekly',
    date: 'Thursdays 18:00',
    location: 'Paris Campus',
    image: 'https://images.unsplash.com/photo-1764874299006-bf4266427ec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    video: ''
  },
  {
    id: 'e5',
    title: 'Panel Discussion & Shipping Friday',
    type: 'weekly',
    date: 'Thu 18:00 · Fri 14:00',
    location: 'Paris Campus',
    image: 'https://images.unsplash.com/photo-1764874299006-bf4266427ec9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    video: ''
  }
];

export const LatestEvents = () => {
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  return (
    <section className="bg-neutral-50 py-12 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <EditableContent 
              id="latest-events-label"
              defaultContent="Agenda"
              enableProse={false}
              className="text-teal-600 text-[10px] font-mono tracking-widest uppercase mb-0.5 block [&_p]:m-0"
            />
            <EditableContent 
              id="latest-events-title"
              defaultContent="Latest Events"
              enableProse={false}
              className="text-2xl md:text-3xl font-serif text-neutral-900 tracking-tight [&_p]:m-0"
            />
          </div>
          <EditableLink
            id="latest-events-button-url"
            defaultHref="/events"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-teal-600 transition-colors"
          >
            <EditableContent 
              id="latest-events-button"
              defaultContent="View Full Calendar"
              enableProse={false}
              multiline={false}
              secondaryId="latest-events-button-url"
              secondaryDefault="/events"
              secondaryLabel="Redirection"
              secondaryPlaceholder="/events or https://..."
              className="[&_p]:m-0"
            />
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </EditableLink>
        </div>

        <EditableCollection
          id="latest-events"
          defaultData={events}
          maxItems={4}
          containerClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          schema={[
            { key: 'title', label: 'Event Title', type: 'text' },
            { key: 'date', label: 'Date / Time', type: 'text' },
            { key: 'location', label: 'Location (Optional)', type: 'text' },
            { key: 'type', label: 'Type (flagship, weekly, internal)', type: 'select', options: ['flagship', 'weekly', 'internal'] },
            { key: 'image', label: 'Image', type: 'image' },
            { key: 'video', label: 'Video URL (Optional)', type: 'text' },
            { key: 'button1_show', label: 'Show button 1', type: 'toggle' },
            { key: 'button1_label', label: 'Button 1 - Text', type: 'text', showWhen: 'button1_show' },
            { key: 'button1_url', label: 'Button 1 - URL', type: 'text', showWhen: 'button1_show' },
            { key: 'button2_show', label: 'Show button 2', type: 'toggle' },
            { key: 'button2_label', label: 'Button 2 - Text', type: 'text', showWhen: 'button2_show' },
            { key: 'button2_url', label: 'Button 2 - URL', type: 'text', showWhen: 'button2_show' },
          ]}
          renderItem={(event) => (
            <motion.div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedEvent(event)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedEvent(event)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="group cursor-pointer bg-white border border-neutral-200 rounded-md overflow-hidden hover:border-teal-300 hover:shadow transition-all min-w-0"
            >
              <div className="aspect-[3/2] overflow-hidden bg-neutral-100">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-3">
                <h3 className="font-serif text-sm md:text-base text-neutral-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                  {event.title}
                </h3>
                {event.date && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500 font-mono">
                    <Calendar className="w-3 h-3 text-teal-500 shrink-0" />
                    {event.date}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        />

        <AnimatePresence>
          {selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedEvent(null)}
                className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden relative z-10"
              >
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 z-20 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-neutral-700" />
                </button>
                <div className="aspect-video bg-neutral-100">
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl font-serif text-neutral-900 mb-2">
                    {selectedEvent.title}
                  </h2>
                  {selectedEvent.date && (
                    <p className="flex items-center gap-2 text-sm text-neutral-600 font-mono mb-4">
                      <Calendar className="w-4 h-4 text-teal-500" />
                      {selectedEvent.date}
                    </p>
                  )}
                  {selectedEvent.location && (
                    <p className="text-sm text-neutral-500 mb-4">{selectedEvent.location}</p>
                  )}
                  <CardButtons
                    item={selectedEvent}
                    defaultButtons={[
                      { label: 'Register', primary: true },
                      { label: 'Add to Calendar', primary: false },
                    ]}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
