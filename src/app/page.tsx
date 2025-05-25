// src/app/page.tsx
'use client';
import { useEffect, useState } from 'react';

interface CsvRow {
  'Index #': string;
  Value: string;
}

interface CalculatedValues {
  Alpha: number;
  Beta: number;
  Charlie: number;
}

interface ParseResult {
  data: CsvRow[];
  errors: unknown[];
  meta: {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    truncated: boolean;
    cursor: number;
  };
}

export default function Home() {
  const [tableData, setTableData] = useState<CsvRow[]>([]);
  const [table2, setTable2] = useState<CalculatedValues | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const csvUrl = '/Table_Input.csv';
        
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        
        const Papa = (await import('papaparse')).default;
        
        const results = await new Promise<ParseResult>((resolve) => {
          Papa.parse<CsvRow>(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: false,
            complete: (parseResults: ParseResult) => resolve(parseResults),
          });
        });
        
        setTableData(results.data);

        const getValue = (label: string): number => {
          const row = results.data.find((r: CsvRow) => r["Index #"] === label);
          return parseInt(row?.Value || '0');
        };

        const A5 = getValue("A5");
        const A20 = getValue("A20");
        const A15 = getValue("A15");
        const A7 = getValue("A7");
        const A13 = getValue("A13");
        const A12 = getValue("A12");

        const calculated: CalculatedValues = {
          Alpha: A5 + A20,
          Beta: Math.floor(A15 / A7),
          Charlie: A13 * A12,
        };

        setTable2(calculated);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Table 1</h1>
      <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '10px' }}>Index #</th>
            <th style={{ border: '1px solid black', padding: '10px' }}>Value</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) =>
            row["Index #"] ? (
              <tr key={`${row["Index #"]}-${index}`}>
                <td style={{ border: '1px solid black', padding: '10px' }}>{row["Index #"]}</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{row["Value"]}</td>
              </tr>
            ) : null
          )}
        </tbody>
      </table>

      {table2 && (
        <>
          <h2 style={{ marginTop: '3rem' }}>Table 2</h2>
          <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '10px' }}>Category</th>
                <th style={{ border: '1px solid black', padding: '10px' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid black', padding: '10px' }}>Alpha</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{table2.Alpha}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '10px' }}>Beta</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{table2.Beta}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid black', padding: '10px' }}>Charlie</td>
                <td style={{ border: '1px solid black', padding: '10px' }}>{table2.Charlie}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}