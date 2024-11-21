import React, { useState } from 'react';
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, FolderTree, List, X, Video, FileText, File, Globe } from 'lucide-react';

// Mock data for available modules
const availableModules = [
  { id: 1, name: "Einführung in wissenschaftliches Arbeiten", description: "Grundlegende Konzepte und Methoden" },
  { id: 2, name: "Literaturrecherche Grundlagen", description: "Systematische Suche in Datenbanken" },
  { id: 3, name: "Zitieren und Referenzieren", description: "Korrekte Quellenangaben und Zitierweisen" },
  { id: 4, name: "Akademisches Schreiben", description: "Strukturierung wissenschaftlicher Texte" },
  { id: 5, name: "Präsentationstechniken", description: "Effektive Präsentation von Forschungsergebnissen" }
];

// Mock data for skills hierarchy
const mockSkillsData = {
  hierarchy: [
    {
      name: "State of the Art",
      children: []
    },
    {
      name: "Literaturorganisation",
      children: []
    },
    {
      name: "Zielbestimmung",
      children: []
    },
    {
      name: "Durchsicht",
      children: []
    },
    {
      name: "Nachbereitung",
      children: []
    }
  ]
};

const ModuleView = () => {
  const [viewMode, setViewMode] = useState('skills');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [moduleSearchTerm, setModuleSearchTerm] = useState('');
  const [selectedModules, setSelectedModules] = useState([
    { id: 1, name: "Modul 1" }
  ]);
  const [author, setAuthor] = useState(['Michael Ganske']);

  // Filter modules based on search term
  const filteredModules = availableModules.filter(module => 
    module.name.toLowerCase().includes(moduleSearchTerm.toLowerCase()) &&
    !selectedModules.some(selected => selected.id === module.id)
  );

  // Helper component for the basic data tab
  const BasicDataTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Titel</label>
        <Input placeholder="Titel eingeben" />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Slug</label>
        <Input placeholder="titel" className="bg-gray-50" />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Beschreibung</label>
        <Textarea placeholder="Beschreibung eingeben" className="h-32" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Autoren</label>
        <div className="space-y-2">
          {author.map((name, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="bg-gray-100 px-3 py-2 rounded flex-1">
                {name}
              </div>
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Hinzufügen
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Lizenz</label>
        <div className="bg-gray-100 px-3 py-2 rounded">
          CC BY 4.0
        </div>
      </div>
    </div>
  );

  // Helper component for the learning content tab
  const LearningContentTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Module (optional)</h3>
        <p className="text-sm text-gray-500 mb-4">
          Durch das Hinzufügen von Modulen zu einer Lerneinheit wird diese zu einer Verbund-Lerneinheit. 
          Beim Ausspielen der Verbund-Lerneinheit wird Lernenden zunächst der Lerninhalt der Verbund-Lerneinheit angezeigt. 
          Die Lernkontrolle der Verbund-Lerneinheit wird ausgespielt, nachdem Lernende die Lerninhalte der enthaltenen Module bearbeitet haben.
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedModules.map((module) => (
            <div 
              key={module.id} 
              className="bg-gray-100 p-4 rounded relative group min-w-[200px]"
            >
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-1 right-1 p-0 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setSelectedModules(prev => 
                  prev.filter(m => m.id !== module.id)
                )}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="pt-4">{module.name}</div>
            </div>
          ))}
          <Button 
            variant="outline" 
            className="h-auto py-4 px-6 min-w-[200px]"
            onClick={() => setIsModuleDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Modul hinzufügen
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Lerninhalt</h3>
        <p className="text-sm text-gray-500 mb-4">
          Inhalt, der zur Wissensvermittlung genutzt werden soll. Wenn mehrere Elemente angelegt werden, 
          können diese in ihrer Reihenfolge verschoben werden um die gewünschte Struktur zu erreichen.
        </p>
        <div className="flex gap-2 mb-4">
          <Button variant="outline" className="gap-2">
            <Video className="h-4 w-4" />
            Video hinzufügen
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Artikel hinzufügen
          </Button>
          <Button variant="outline" className="gap-2">
            <File className="h-4 w-4" />
            PDF hinzufügen
          </Button>
          <Button variant="outline" className="gap-2">
            <Globe className="h-4 w-4" />
            Webseite hinzufügen
          </Button>
        </div>
        <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
          Noch keine Lerninhalte erstellt.
        </div>
      </div>
    </div>
  );

  // Helper component for the learning control tab
  const LearningControlTab = () => (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Fragen, die Studierenden nach Bearbeitung der Lernheit angezeigt werden sollen. 
        Die erfolgreiche Beantwortung der Fragen ist notwendig, um diese Lernheit erfolgreich abzuschließen.
      </p>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Multiple Choice</h3>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Aufgabe hinzufügen
          </Button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Frage:</label>
              <div>Was ist 1+1?</div>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">Antwort 1:</label>
                <div>3</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Antwort 2:</label>
                <div>2</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Antwort 3:</label>
                <div>11</div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Hinweise:</label>
              <div className="text-gray-500">Keine Hinweise</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Module Selection Dialog component
  const ModuleSelectionDialog = () => (
    <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modul auswählen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Module durchsuchen..."
              value={moduleSearchTerm}
              onChange={(e) => setModuleSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="max-h-96 overflow-y-auto">
            {filteredModules.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Keine Module gefunden
              </div>
            ) : (
              <div className="space-y-2">
                {filteredModules.map((module) => (
                  <div
                    key={module.id}
                    className="p-4 hover:bg-gray-100 rounded-lg cursor-pointer"
                    onClick={() => {
                      setSelectedModules(prev => [...prev, module]);
                      setIsModuleDialogOpen(false);
                      setModuleSearchTerm('');
                    }}
                  >
                    <div className="font-medium">{module.name}</div>
                    <div className="text-sm text-gray-500">{module.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-200 p-2 rounded">
        <Button variant="ghost" className="gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white">1</span>
          Grunddaten
        </Button>
        <Button variant="ghost" className="gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white">2</span>
          Skillansicht
        </Button>
        <Button variant="ghost" className="gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white">3</span>
          Modulansicht
        </Button>
        <Button variant="ghost" className="gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white">4</span>
          Vorschau
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Left Side - Skills/Modules List */}
        <div className="w-1/3">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="font-medium">Abhängigkeiten</h3>
                <p className="text-sm text-gray-500">
                  Wählen Sie Skills und Module aus um diese per Drag & Drop den Lerneinheiten zuzuweisen
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    variant={viewMode === 'skills' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('skills')}
                    className="gap-2"
                  >
                    <FolderTree className="h-4 w-4" />
                    Skills
                  </Button>
                  <Button 
                    variant={viewMode === 'modules' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('modules')}
                    className="gap-2"
                  >
                    <List className="h-4 w-4" />
                    Module
                  </Button>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Suche"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-1">
                  {mockSkillsData.hierarchy.map((item, index) => (
                    <div 
                      key={index}
                      className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Content Tabs */}
        <div className="w-2/3">
          <Card>
            <CardContent className="p-6">
            <Tabs defaultValue="basisdaten" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="basisdaten">Basisdaten</TabsTrigger>
                  <TabsTrigger value="lerninhalt">Lerninhalt</TabsTrigger>
                  <TabsTrigger value="lernkontrolle">Lernkontrolle</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basisdaten">
                  <BasicDataTab />
                </TabsContent>
                
                <TabsContent value="lerninhalt">
                  <LearningContentTab />
                </TabsContent>
                
                <TabsContent value="lernkontrolle">
                  <LearningControlTab />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Module Selection Dialog */}
      <ModuleSelectionDialog />
    </div>
  );
};

export default ModuleView;