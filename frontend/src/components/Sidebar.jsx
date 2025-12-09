import React from "react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-50 h-screen fixed left-0 top-0 border-r border-gray-200">
      {/* Logo and User Section */}
      <div className="bg-gray-800 p-4 text-white">
        <div className="text-xl font-bold mb-1">Vault</div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Aayush Arunam</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-1">
        <div className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-200 rounded cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Dashboard</span>
        </div>
        <div className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-200 rounded cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Nexus</span>
        </div>
        <div className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-200 rounded cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Intake</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-200 rounded cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Services</span>
            <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-8 space-y-1 mt-1">
            <div className="flex items-center space-x-2 p-2 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span>Pre-active</span>
            </div>
            <div className="flex items-center space-x-2 p-2 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center space-x-2 p-2 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Blocked</span>
            </div>
            <div className="flex items-center space-x-2 p-2 text-sm text-gray-600">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Closed</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-200 rounded cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Invoices</span>
            <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-8 space-y-1 mt-1">
            <div className="flex items-center space-x-2 p-2 text-sm bg-blue-50 text-blue-700 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Proforma Invoices</span>
            </div>
            <div className="flex items-center space-x-2 p-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Final Invoices</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

