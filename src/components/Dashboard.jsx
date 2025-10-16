import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { detectProvidersFromFiles, extractProjectMetadata } from '../lib/repoScanner';
import { generateDopplerSetCommands, generateDotenvExample } from '../lib/dopplerConfigGenerator';
import { buildIntegrationGraph } from '../lib/integrationGraph';

export default function Dashboard() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [files, setFiles] = useState([]);
  const [providers, setProviders] = useState([]);
  const [meta, setMeta] = useState({ title: '', description: '' });
  const [project, setProject] = useState('my-project');
  const [config, setConfig] = useState('production');

  function onDrop(e) {
    e.preventDefault();
    const items = [...(e.dataTransfer?.items || [])];
    readEntries(items);
  }

  function onPickFiles(e) {
    const fileList = [...(e.target?.files || [])];
    readFiles(fileList);
  }

  function readEntries(items) {
    const filePromises = items
      .filter((i) => i.kind === 'file')
      .map((i) => i.getAsFile())
      .map(readFile);
    Promise.all(filePromises).then(handleFiles);
  }

  function readFiles(fileList) {
    Promise.all(fileList.map(readFile)).then(handleFiles);
  }

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ path: file.name, content: reader.result });
      reader.readAsText(file);
    });
  }

  function handleFiles(allFiles) {
    setFiles(allFiles);
    const detected = detectProvidersFromFiles(allFiles);
    setProviders(detected);
    setMeta(extractProjectMetadata(allFiles));
  }

  const commands = generateDopplerSetCommands({ project, config, providers });
  const dotenv = generateDotenvExample(providers);
  const graph = buildIntegrationGraph({ providers, metadata: meta });

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
  <h1>🚀 VaultCraft</h1>
        <p>AI Secrets Orchestrator for no-coders</p>
        <button 
          onClick={() => loginWithRedirect()}
          style={{ 
            padding: '12px 24px', 
            fontSize: '16px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Login to Start
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
  <h1>🚀 VaultCraft</h1>
        <div>
          <span style={{ marginRight: 16 }}>Welcome, {user?.name || user?.email}!</span>
          <button 
            onClick={() => logout({ returnTo: window.location.origin })}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ 
        border: '2px dashed #007bff', 
        padding: 24, 
        borderRadius: 8, 
        marginBottom: 24,
        textAlign: 'center'
      }}>
        <h3>📁 Drop your project files here</h3>
        <p>Or select files to auto-detect API keys and generate Doppler commands</p>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          style={{ 
            border: '2px dashed #999', 
            padding: 24, 
            borderRadius: 8, 
            marginBottom: 16,
            backgroundColor: '#f8f9fa'
          }}
        >
          <p>Drag and drop project files here</p>
        </div>
        <input 
          type="file" 
          multiple 
          onChange={onPickFiles}
          style={{ marginTop: 16 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <h2>🎯 Project Settings</h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>
              Project ID: 
              <input 
                value={project} 
                onChange={(e) => setProject(e.target.value)}
                style={{ marginLeft: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </label>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8 }}>
              Config: 
              <input 
                value={config} 
                onChange={(e) => setConfig(e.target.value)}
                style={{ marginLeft: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </label>
          </div>
        </div>

        <div>
          <h2>📊 Project Info</h2>
          <p><strong>Title:</strong> {meta.title}</p>
          <p><strong>Description:</strong> {meta.description}</p>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>🔍 Detected Providers</h2>
        {providers.length === 0 ? (
          <p>No providers detected yet. Upload your project files to get started!</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {providers.map((p) => (
              <span 
                key={p}
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  borderRadius: '20px',
                  fontSize: '14px'
                }}
              >
                {p}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>🔧 Doppler Commands</h2>
        {commands.length === 0 ? (
          <p>No required secrets found.</p>
        ) : (
          <pre style={{ 
            background: '#1a1a1a', 
            color: '#00ff00', 
            padding: 16, 
            borderRadius: 8,
            overflow: 'auto',
            fontSize: '14px'
          }}>
{commands.map((c) => c.command).join('\n')}
          </pre>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>📄 .env Example</h2>
        <pre style={{ 
          background: '#1a1a1a', 
          color: '#00ffff', 
          padding: 16, 
          borderRadius: 8,
          overflow: 'auto',
          fontSize: '14px'
        }}>
{dotenv}
        </pre>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2>🕸️ Integration Graph</h2>
        <pre style={{ 
          background: '#1a1a1a', 
          color: '#ffffff', 
          padding: 16, 
          borderRadius: 8,
          overflow: 'auto',
          fontSize: '14px'
        }}>
{JSON.stringify(graph, null, 2)}
        </pre>
      </div>
    </div>
  );
}



