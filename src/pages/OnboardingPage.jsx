import React, { useState } from 'react'

const OnboardingPage = () => {
  const [step, setStep] = useState(1)
  const [projectName, setProjectName] = useState('')
  const [projectType, setProjectType] = useState('')

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      padding: 24, 
      maxWidth: 600, 
      margin: '0 auto' 
    }}>
  <h1>🚀 VaultCraft</h1>
      <p>AI-powered secrets orchestration for your projects</p>
      
      {step === 1 && (
        <div>
          <h2>Step 1: Project Setup</h2>
          <div style={{ marginBottom: 16 }}>
            <label>Project Name:</label>
            <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              style={{ 
                width: '100%', 
                padding: 8, 
                marginTop: 4,
                border: '1px solid #ccc',
                borderRadius: 4
              }}
              placeholder="Enter your project name"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label>Project Type:</label>
            <select 
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              style={{ 
                width: '100%', 
                padding: 8, 
                marginTop: 4,
                border: '1px solid #ccc',
                borderRadius: 4
              }}
            >
              <option value="">Select project type</option>
              <option value="react">React Application</option>
              <option value="node">Node.js API</option>
              <option value="python">Python Application</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Step 2: API Detection</h2>
          <p>Our AI will automatically detect and configure:</p>
          <ul>
            <li>✅ Database connections</li>
            <li>✅ Authentication services</li>
            <li>✅ Payment processors</li>
            <li>✅ Cloud services</li>
            <li>✅ Third-party APIs</li>
          </ul>
          <div style={{ 
            padding: 16, 
            backgroundColor: '#f0f8ff', 
            borderRadius: 8,
            marginTop: 16
          }}>
            <p><strong>Ready to scan your project?</strong></p>
            <p>Upload your project files or connect your repository.</p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Step 3: Configuration Complete</h2>
          <p>🎉 Your secrets are now managed by AI!</p>
          <div style={{ 
            padding: 16, 
            backgroundColor: '#f0fff0', 
            borderRadius: 8,
            marginTop: 16
          }}>
            <h3>What's Next?</h3>
            <ul>
              <li>🔐 Secure API key storage</li>
              <li>🔄 Automatic environment sync</li>
              <li>📊 Usage monitoring</li>
              <li>🚨 Security alerts</li>
            </ul>
          </div>
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginTop: 24 
      }}>
        <button 
          onClick={handleBack}
          disabled={step === 1}
          style={{ 
            padding: '8px 16px',
            border: '1px solid #ccc',
            borderRadius: 4,
            backgroundColor: step === 1 ? '#f5f5f5' : 'white',
            cursor: step === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Back
        </button>
        <button 
          onClick={handleNext}
          disabled={step === 3}
          style={{ 
            padding: '8px 16px',
            border: '1px solid #007bff',
            borderRadius: 4,
            backgroundColor: '#007bff',
            color: 'white',
            cursor: step === 3 ? 'not-allowed' : 'pointer'
          }}
        >
          {step === 3 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  )
}

export default OnboardingPage

