"use client";

import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, X, Search } from 'lucide-react';

const AUTHORS_LIST = [
  { id: 1, name: "Dr. Emma Schmidt", department: "Informatik" },
  { id: 2, name: "Prof. Thomas Weber", department: "Mathematik" },
  { id: 3, name: "Dr. Laura Müller", department: "Physik" },
  { id: 4, name: "Michael Ganske", department: "Informatik" },
  { id: 5, name: "Dr. Sarah Wagner", department: "Chemie" },
  { id: 6, name: "Prof. David Fischer", department: "Informatik" },
  { id: 7, name: "Dr. Julia König", department: "Biologie" },
  { id: 8, name: "Prof. Marcus Bauer", department: "Physik" },
  { id: 9, name: "Dr. Anna Schulz", department: "Mathematik" },
  { id: 10, name: "Prof. Peter Hoffmann", department: "Chemie" }
];

const CourseEditor = () => {
  const [authors, setAuthors] = useState(['Michael Ganske']);
  const [isAuthorDialogOpen, setIsAuthorDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAuthors = AUTHORS_LIST.filter(author => 
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !authors.includes(author.name)
  );

  const handleAddAuthor = (authorName: string) => {
    if (!authors.includes(authorName)) {
      setAuthors([...authors, authorName]);
    }
    setIsAuthorDialogOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Kurs Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grunddaten">
            <TabsList className="mb-4">
              <TabsTrigger value="grunddaten">Grunddaten</TabsTrigger>
              <TabsTrigger value="skills">Skillansicht</TabsTrigger>
              <TabsTrigger value="module">Modulansicht</TabsTrigger>
            </TabsList>

            <TabsContent value="grunddaten">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <label className="block text-sm font-medium mb-1">Titel</label>
                  <Input placeholder="Kurstitel eingeben" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <Input placeholder="kurs-slug" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Beschreibung</label>
                  <Textarea placeholder="Kursbeschreibung eingeben" className="h-32" />
                </div>

                {/* Authors Section */}
                <div>
                  <label className="block text-sm font-medium mb-2">Autoren</label>
                  <div className="space-y-2">
                    {authors.map((author, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={author} readOnly />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setAuthors(authors.filter((_, i) => i !== index))}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsAuthorDialogOpen(true)}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Autor hinzufügen
                    </Button>
                  </div>
                </div>

                {/* Author Selection Dialog */}
                <Dialog open={isAuthorDialogOpen} onOpenChange={setIsAuthorDialogOpen}>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Autor auswählen</DialogTitle>
                    </DialogHeader>
                    
                    {/* Search Input */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Nach Autoren suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Authors List */}
                    <div className="max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-1 gap-2">
                        {filteredAuthors.map((author) => (
                          <div
                            key={author.id}
                            className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
                            onClick={() => handleAddAuthor(author.name)}
                          >
                            <div>
                              <div className="font-medium">{author.name}</div>
                              <div className="text-sm text-gray-500">{author.department}</div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <PlusCircle className="h-4 w-4 mr-2" />
                              Hinzufügen
                            </Button>
                          </div>
                        ))}
                        {filteredAuthors.length === 0 && (
                          <div className="text-center text-gray-500 py-4">
                            Keine Autoren gefunden
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Linked Skill Repositories - Moved above Course Goals */}
                <div>
                  <label className="block text-sm font-medium mb-2">Verlinkte Skill-Repositories</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="-- Kein Repository ausgewählt --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="repo1">Repository 1</SelectItem>
                      <SelectItem value="repo2">Repository 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Course Goals */}
                <div>
                  <label className="block text-sm font-medium mb-2">Kursziele</label>
                  <div className="text-sm text-gray-500 mb-2">Derzeit keine Ziele ausgewählt.</div>
                  <Button variant="outline" className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Ziel hinzufügen
                  </Button>
                </div>

                {/* Prerequisites */}
                <div>
                  <label className="block text-sm font-medium mb-2">Voraussetzungen</label>
                  <div className="text-sm text-gray-500 mb-2">Derzeit keine Voraussetzungen ausgewählt.</div>
                  <Button variant="outline" className="w-full">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Voraussetzung hinzufügen
                  </Button>
                </div>

                {/* Ad-Hoc Link */}
                <div>
                  <Button variant="secondary" className="w-full">
                    Ad-Hoc Link generieren
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="skills">
              <div className="p-4 text-center text-gray-500">
                Skillansicht Inhalt
              </div>
            </TabsContent>

            <TabsContent value="module">
              <div className="p-4 text-center text-gray-500">
                Modulansicht Inhalt
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseEditor;