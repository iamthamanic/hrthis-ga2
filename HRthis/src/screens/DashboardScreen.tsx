import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../state/auth';
import { useCoinEventsStore } from '../state/coinEvents';
import { useCoinsStore } from '../state/coins';
import { useLeavesStore } from '../state/leaves';
import { useTimeRecordsStore } from '../state/timeRecords';

/**
 * Main dashboard screen showing personalized information
 * Different views for employees and admins - now with hooks!
 */
export const DashboardScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getAllLeaveRequests } = useLeavesStore();
  const { getTimeRecords, getMonthlyStats, getWeeklyStats } = useTimeRecordsStore();
  const { getUserBalance } = useCoinsStore();
  const { getNextEvent, getUnlockedEvents } = useCoinEventsStore();

  const displayUser = user;

  if (!user || !displayUser) return null;

  // Get user's data
  const userBalance = getUserBalance(displayUser.id);
  // Normalize employee number: avoid double prefix and ensure 'PN-' once
  const rawEmpNo = displayUser.employeeNumber || '';
  const normalizedEmpNo = (() => {
    const cleaned = String(rawEmpNo).replace(/^PN[-\s]?/i, '');
    return cleaned ? `PN-${cleaned}` : 'PN-—';
  })();
  const todayDate = new Date().toISOString().split('T')[0];
  const todayRecords = getTimeRecords(displayUser.id).filter(record => record.date === todayDate);
  const todayRecord = todayRecords[0];
  
  // Calculate monthly and weekly stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyStats = getMonthlyStats(displayUser.id, currentMonth, currentYear);
  const weeklyStats = getWeeklyStats(displayUser.id);

  // Calculate vacation usage
  const approvedVacations = getAllLeaveRequests()
    .filter(req => 
      req.userId === displayUser.id && 
      req.type === 'VACATION' && 
      req.status === 'APPROVED' &&
      new Date(req.startDate).getFullYear() === currentYear
    );
  
  const usedVacationDays = approvedVacations.reduce((total, req) => {
    const start = new Date(req.startDate);
    const end = new Date(req.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return total + days;
  }, 0);

  // Calculate working hours based on employment type
  const expectedMonthlyHours = displayUser.weeklyHours ? (displayUser.weeklyHours * 4.33) : 0;
  const expectedWeeklyHours = displayUser.weeklyHours || 0;

  // Get coin level info
  const coinBalance = userBalance?.currentBalance || 0;
  const nextEvent = getNextEvent(coinBalance);
  const unlockedEvents = getUnlockedEvents(coinBalance);
  const currentLevel = unlockedEvents.length > 0 ? unlockedEvents[unlockedEvents.length - 1] : null;

  return (
    <div className="flex-1 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header with Profile */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            {/* Profile Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 relative">
              {displayUser.avatarUrl ? (
                <img 
                  src={displayUser.avatarUrl} 
                  alt={displayUser.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <defs>
                    <pattern id="crosshatch" patternUnits="userSpaceOnUse" width="4" height="4">
                      <path d="M0,4 l4,-4 M0,0 l4,4" stroke="#d1d5db" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <circle cx="50" cy="50" r="50" fill="url(#crosshatch)" />
                  <circle cx="50" cy="35" r="18" fill="#9ca3af" />
                  <ellipse cx="50" cy="70" rx="28" ry="20" fill="#9ca3af" />
                </svg>
              )}
            </div>
            
            {/* User Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hallo, {displayUser.firstName || displayUser.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-500 mt-1">
                Personalnummer: {normalizedEmpNo}
              </p>
            </div>
          </div>

          {/* Personalakte Section */}
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-2">Personalakte</p>
            <button 
              onClick={() => navigate('/user/personal-file')}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <span className="mr-2">📁</span>
              Meine Daten
            </button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Heute Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Heute</p>
                <p className="text-3xl font-bold text-gray-900">-</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⏰</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">Nicht gestempelt</p>
          </div>

          {/* Monat Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Monat</p>
                <p className="text-3xl font-bold text-gray-900">107.3h</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Soll: 112h</span>
                <span className="text-orange-600">-65.0h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: '65%' }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">Woche: 15.0h / 40h</p>
          </div>

          {/* Urlaub Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Urlaub</p>
                <p className="text-3xl font-bold text-gray-900">30</p>
                <p className="text-sm text-gray-500">von 30 Tagen</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🏖️</span>
              </div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Genommen:</span>
              <span className="font-medium">0 Tage</span>
            </div>
          </div>

          {/* Browo Coins Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Browo Coins</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-500">Nächstes Level</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">🪙</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gray-400 h-2 rounded-full"
                style={{ width: '0%' }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">0/100</p>
          </div>
        </div>



      </div>
    </div>
  );
};