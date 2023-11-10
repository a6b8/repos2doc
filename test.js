const filePaths = [
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/.DS_Store',
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/a6b8/.DS_Store',
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/a6b8/mina-ns/.DS_Store',
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/a6b8/mina-ns/main/.DS_Store',
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/a6b8/mina-ns/main/a6b8--mina-ns--main.txt',
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/merge--1699601404.txt',
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/merge--1699601431.txt',
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/merge--1699601496.txt',
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/merge--1699601536.txt',
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/merge--1699601706.txt',
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/merge--1699601717.txt',
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/merge--1699601770.txt',
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/merge--1699601795.txt',
  '/Users/andreasbanholzer/PROJEKTE/2023-11-10--repo2gpt/1/repo2file/repo2gpt-temp/single-test--1699601360.txt'
]
  
  // Funktion zur Filterung der Top-Level-Dateien
  function filterTopLevelFiles(filePaths, directory) {
    return filePaths.filter(filePath => {
      // Teilen Sie den Dateipfad in Segmente auf
      const pathSegments = filePath.split('/');
      
      // Überprüfen Sie, ob das Verzeichnis "repo2gpt-temp/" darin enthalten ist
      const repo2gptTempIndex = pathSegments.indexOf(directory);
      const result = repo2gptTempIndex !== -1 && repo2gptTempIndex === pathSegments.length - 2;
      // Wenn das Verzeichnis gefunden wird und es keine weiteren Verzeichnisse danach gibt
      return !result
    });
  }
  
  const topLevelFiles = filterTopLevelFiles(filePaths, 'repo2gpt-temp');
  console.log(topLevelFiles);