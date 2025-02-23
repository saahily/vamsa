import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Users, Heart, BellRing as Ring, BookOpen, Flower2 } from 'lucide-react';
import { ProfileMenu } from '../components/ProfileMenu';
import { FamilyData } from '../types/family';
import { useAuth } from '../contexts/AuthContext';

interface MemberPageProps {
  data: FamilyData;
}

export function MemberPage({ data }: MemberPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const member = data.members[id || ''];
  const { getRelationship } = useAuth();
  const relationship = getRelationship(member.id, data);

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-white mb-4">Member not found</h1>
          <button
            onClick={() => navigate('/family-tree')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Return to Family Tree
          </button>
        </div>
      </div>
    );
  }

  const parents = member.parentIds.map(id => data.members[id]);
  const children = member.childrenIds.map(id => data.members[id]);
  const partner = member.partnerId ? data.members[member.partnerId] : null;

  const getYearDisplay = (birthYear: string, deathYear?: string) => {
    if (deathYear) {
      return `${birthYear} - ${deathYear}`;
    }
    return birthYear;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),rgba(15,23,42,0))]" />
      </div>

      <header className="relative bg-black/30 backdrop-blur-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-start">
            <div>
              <button
                onClick={() => navigate('/family-tree')}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4"
              >
                <ArrowLeft size={20} />
                <span>Back to Family Tree</span>
              </button>
              <h1 className="text-5xl font-serif font-bold text-white tracking-wide">{member.name}</h1>
              {member.deathYear && (
                <div className="flex items-center gap-2 mt-2 text-slate-400">
                  <Flower2 size={16} />
                  <span>In Memory • {getYearDisplay(member.birthYear, member.deathYear)}</span>
                </div>
              )}
              {relationship && (
                <div className="text-lg text-blue-400 mt-2 font-medium">
                  {relationship}
                </div>
              )}
            </div>
            <ProfileMenu />
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50"
          >
            <div className="flex items-start gap-6">
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className={`w-32 h-32 rounded-xl object-cover border-2 border-blue-500/30 ${
                    member.deathYear ? 'grayscale' : ''
                  }`}
                />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-slate-700/50 flex items-center justify-center border-2 border-blue-500/30">
                  <Users className="w-16 h-16 text-blue-400" />
                </div>
              )}
              <div>
                <h2 className={`text-2xl font-serif font-semibold mb-2 ${
                  member.deathYear ? 'text-slate-300' : 'text-white'
                }`}>
                  {member.name}
                </h2>
                <div className="flex items-center gap-2 mt-4 text-slate-400">
                  <Calendar size={16} />
                  <span>Born {member.birthYear}</span>
                </div>
                {member.deathYear && (
                  <div className="flex items-center gap-2 mt-2 text-slate-400">
                    <Flower2 size={16} />
                    <span>Passed {member.deathYear}</span>
                  </div>
                )}
                {partner && member.marriageYear && (
                  <div className="flex items-center gap-2 mt-2 text-slate-400">
                    <Ring size={16} />
                    <span>Married {member.marriageYear}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Family Connections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 lg:col-span-2"
          >
            <h2 className="text-xl font-serif font-semibold text-white mb-4 flex items-center gap-2">
              <Heart size={20} className="text-blue-400" />
              Family Connections
            </h2>
            
            {partner && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Partner</h3>
                <button
                  onClick={() => navigate(`/member/${partner.id}`)}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors w-full"
                >
                  {partner.imageUrl ? (
                    <img
                      src={partner.imageUrl}
                      alt={partner.name}
                      className={`w-10 h-10 rounded-full object-cover border border-blue-500/30 ${
                        partner.deathYear ? 'grayscale' : ''
                      }`}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-600/50 flex items-center justify-center border border-blue-500/30">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                  )}
                  <div className="text-left">
                    <div className={`text-sm font-medium ${
                      partner.deathYear ? 'text-slate-300' : 'text-white'
                    }`}>
                      {partner.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {getYearDisplay(partner.birthYear, partner.deathYear)} • Married {member.marriageYear}
                    </div>
                  </div>
                </button>
              </div>
            )}

            {parents.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Parents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parents.map(parent => (
                    <button
                      key={parent.id}
                      onClick={() => navigate(`/member/${parent.id}`)}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                    >
                      {parent.imageUrl ? (
                        <img
                          src={parent.imageUrl}
                          alt={parent.name}
                          className={`w-10 h-10 rounded-full object-cover border border-blue-500/30 ${
                            parent.deathYear ? 'grayscale' : ''
                          }`}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-600/50 flex items-center justify-center border border-blue-500/30">
                          <Users className="w-6 h-6 text-blue-400" />
                        </div>
                      )}
                      <div className="text-left">
                        <div className={`text-sm font-medium ${
                          parent.deathYear ? 'text-slate-300' : 'text-white'
                        }`}>
                          {parent.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {getYearDisplay(parent.birthYear, parent.deathYear)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {children.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">Children</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => navigate(`/member/${child.id}`)}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                    >
                      {child.imageUrl ? (
                        <img
                          src={child.imageUrl}
                          alt={child.name}
                          className={`w-10 h-10 rounded-full object-cover border border-blue-500/30 ${
                            child.deathYear ? 'grayscale' : ''
                          }`}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-600/50 flex items-center justify-center border border-blue-500/30">
                          <Users className="w-6 h-6 text-blue-400" />
                        </div>
                      )}
                      <div className="text-left">
                        <div className={`text-sm font-medium ${
                          child.deathYear ? 'text-slate-300' : 'text-white'
                        }`}>
                          {child.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {getYearDisplay(child.birthYear, child.deathYear)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Biography Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 lg:col-span-3"
          >
            <h2 className="text-xl font-serif font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-400" />
              Biography
            </h2>
            <div className="prose prose-invert prose-lg max-w-none">
              {member.biography?.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-slate-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}