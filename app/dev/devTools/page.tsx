// pages/dev-tools.tsx
"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  Terminal,
  Database,
  Github,
  Palette,
  Zap,
  Settings,
} from "lucide-react";

export default function DevToolsPage() {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const copyToClipboard = async (text: string, commandId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCommand(commandId);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const CommandCard = ({
    title,
    command,
    description,
    id,
  }: {
    title: string;
    command: string;
    description: string;
    id: string;
  }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between bg-slate-900 text-green-400 p-3 rounded-lg font-mono text-sm">
          <code>{command}</code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(command, id)}
            className="text-green-400 hover:text-green-300"
          >
            {copiedCommand === id ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            🛠️ Dev Tools Dashboard
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Votre boîte à outils complète pour le développement Next.js avec
            toutes les commandes et composants essentiels
          </p>
        </div>

        <Tabs defaultValue="prisma" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="prisma" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Prisma
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </TabsTrigger>
            <TabsTrigger value="shadcn" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Shadcn/UI
            </TabsTrigger>
            <TabsTrigger value="lucide" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Lucide
            </TabsTrigger>
            <TabsTrigger value="libraries" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Librairies
            </TabsTrigger>
            <TabsTrigger value="powershell" className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              PowerShell
            </TabsTrigger>
          </TabsList>

          {/* Prisma Commands */}
          <TabsContent value="prisma" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-slate-800">
                  🗄️ Commandes Prisma Essentielles
                </h2>

                <CommandCard
                  id="prisma-init"
                  title="Initialiser Prisma"
                  command="npx prisma init"
                  description="Initialise un nouveau projet Prisma avec schema.prisma et .env"
                />

                <CommandCard
                  id="prisma-generate"
                  title="Générer le Client"
                  command="npx prisma generate"
                  description="Génère le client Prisma basé sur votre schéma"
                />

                <CommandCard
                  id="prisma-migrate"
                  title="Créer une Migration"
                  command="npx prisma migrate dev --name init"
                  description="Crée et applique une nouvelle migration"
                />

                <CommandCard
                  id="prisma-push"
                  title="Push Schema"
                  command="npx prisma db push"
                  description="Synchronise votre schéma avec la base de données"
                />

                <CommandCard
                  id="prisma-studio"
                  title="Ouvrir Prisma Studio"
                  command="npx prisma studio"
                  description="Lance l'interface web pour gérer vos données"
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-slate-700">
                  📝 Exemple d'utilisation
                </h3>
                <Card>
                  <CardContent className="p-4">
                    <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                      {`// Exemple CRUD avec Prisma Client
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// CREATE
const user = await prisma.user.create({
  data: {
    firstName: "John",
    lastName: "Doe", 
    email: "john@example.com"
  }
})

// READ
const users = await prisma.user.findMany({
  where: { email: { contains: "@example.com" } }
})

// UPDATE  
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: { email: "newemail@example.com" }
})

// DELETE
await prisma.user.delete({
  where: { id: 1 }
})`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* GitHub Commands */}
          <TabsContent value="github" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-slate-800">
                  🐙 Commandes Git/GitHub
                </h2>

                <CommandCard
                  id="git-init"
                  title="Initialiser un Repo"
                  command="git init && git add . && git commit -m 'Initial commit'"
                  description="Initialise un nouveau repository Git"
                />

                <CommandCard
                  id="git-clone"
                  title="Cloner un Repository"
                  command="git clone https://github.com/username/repo.git"
                  description="Clone un repository distant"
                />

                <CommandCard
                  id="git-branch"
                  title="Créer une Branche"
                  command="git checkout -b feature/new-feature"
                  description="Crée et bascule vers une nouvelle branche"
                />

                <CommandCard
                  id="git-push"
                  title="Push vers GitHub"
                  command="git add . && git commit -m 'feat: add new feature' && git push"
                  description="Ajoute, commit et push les changements"
                />

                <CommandCard
                  id="git-pull"
                  title="Pull Request"
                  command="gh pr create --title 'New Feature' --body 'Description'"
                  description="Crée une Pull Request via GitHub CLI"
                />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-slate-700">
                  🔄 Workflow Git
                </h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">1</Badge>
                        <span>git checkout -b feature/nom-feature</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">2</Badge>
                        <span>Développer la fonctionnalité</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">3</Badge>
                        <span>git add . && git commit -m "message"</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">4</Badge>
                        <span>git push origin feature/nom-feature</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">5</Badge>
                        <span>Créer une Pull Request</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Shadcn/UI Components */}
          <TabsContent value="shadcn" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">
              🎨 Top 40 Composants Shadcn/UI
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "Button",
                  command: "npx shadcn-ui@latest add button",
                  usage: "<Button variant='default'>Click me</Button>",
                },
                {
                  name: "Card",
                  command: "npx shadcn-ui@latest add card",
                  usage:
                    "<Card><CardHeader><CardTitle>Title</CardTitle></CardHeader></Card>",
                },
                {
                  name: "Input",
                  command: "npx shadcn-ui@latest add input",
                  usage: "<Input placeholder='Enter text...' />",
                },
                {
                  name: "Dialog",
                  command: "npx shadcn-ui@latest add dialog",
                  usage: "<Dialog><DialogTrigger>Open</DialogTrigger></Dialog>",
                },
                {
                  name: "Tabs",
                  command: "npx shadcn-ui@latest add tabs",
                  usage:
                    "<Tabs defaultValue='tab1'><TabsList>...</TabsList></Tabs>",
                },
                {
                  name: "Form",
                  command: "npx shadcn-ui@latest add form",
                  usage: "<Form {...form}><form>...</form></Form>",
                },
                {
                  name: "Table",
                  command: "npx shadcn-ui@latest add table",
                  usage: "<Table><TableHeader>...</TableHeader></Table>",
                },
                {
                  name: "Select",
                  command: "npx shadcn-ui@latest add select",
                  usage: "<Select><SelectTrigger>...</SelectTrigger></Select>",
                },
                {
                  name: "Dropdown Menu",
                  command: "npx shadcn-ui@latest add dropdown-menu",
                  usage:
                    "<DropdownMenu><DropdownMenuTrigger>...</DropdownMenuTrigger></DropdownMenu>",
                },
                {
                  name: "Badge",
                  command: "npx shadcn-ui@latest add badge",
                  usage: "<Badge variant='default'>New</Badge>",
                },
                {
                  name: "Alert",
                  command: "npx shadcn-ui@latest add alert",
                  usage:
                    "<Alert><AlertDescription>Message</AlertDescription></Alert>",
                },
                {
                  name: "Checkbox",
                  command: "npx shadcn-ui@latest add checkbox",
                  usage: "<Checkbox id='terms' />",
                },
                {
                  name: "Radio Group",
                  command: "npx shadcn-ui@latest add radio-group",
                  usage:
                    "<RadioGroup><RadioGroupItem value='option1' /></RadioGroup>",
                },
                {
                  name: "Switch",
                  command: "npx shadcn-ui@latest add switch",
                  usage:
                    "<Switch checked={isChecked} onCheckedChange={setIsChecked} />",
                },
                {
                  name: "Textarea",
                  command: "npx shadcn-ui@latest add textarea",
                  usage: "<Textarea placeholder='Type your message...' />",
                },
                {
                  name: "Label",
                  command: "npx shadcn-ui@latest add label",
                  usage: "<Label htmlFor='email'>Email</Label>",
                },
                {
                  name: "Separator",
                  command: "npx shadcn-ui@latest add separator",
                  usage: "<Separator className='my-4' />",
                },
                {
                  name: "Avatar",
                  command: "npx shadcn-ui@latest add avatar",
                  usage: "<Avatar><AvatarImage src='...' /></Avatar>",
                },
                {
                  name: "Progress",
                  command: "npx shadcn-ui@latest add progress",
                  usage: "<Progress value={33} className='w-full' />",
                },
                {
                  name: "Skeleton",
                  command: "npx shadcn-ui@latest add skeleton",
                  usage: "<Skeleton className='h-4 w-full' />",
                },
                {
                  name: "Toast",
                  command: "npx shadcn-ui@latest add toast",
                  usage:
                    "toast({ title: 'Success', description: 'Message sent!' })",
                },
                {
                  name: "Tooltip",
                  command: "npx shadcn-ui@latest add tooltip",
                  usage:
                    "<Tooltip><TooltipTrigger>Hover</TooltipTrigger></Tooltip>",
                },
                {
                  name: "Popover",
                  command: "npx shadcn-ui@latest add popover",
                  usage:
                    "<Popover><PopoverTrigger>Open</PopoverTrigger></Popover>",
                },
                {
                  name: "Command",
                  command: "npx shadcn-ui@latest add command",
                  usage:
                    "<Command><CommandInput placeholder='Search...' /></Command>",
                },
                {
                  name: "Calendar",
                  command: "npx shadcn-ui@latest add calendar",
                  usage:
                    "<Calendar mode='single' selected={date} onSelect={setDate} />",
                },
                {
                  name: "Date Picker",
                  command: "npx shadcn-ui@latest add date-picker",
                  usage: "<DatePicker date={date} setDate={setDate} />",
                },
                {
                  name: "Sheet",
                  command: "npx shadcn-ui@latest add sheet",
                  usage: "<Sheet><SheetTrigger>Open</SheetTrigger></Sheet>",
                },
                {
                  name: "Accordion",
                  command: "npx shadcn-ui@latest add accordion",
                  usage:
                    "<Accordion type='single'><AccordionItem>...</AccordionItem></Accordion>",
                },
                {
                  name: "Alert Dialog",
                  command: "npx shadcn-ui@latest add alert-dialog",
                  usage:
                    "<AlertDialog><AlertDialogTrigger>Delete</AlertDialogTrigger></AlertDialog>",
                },
                {
                  name: "Aspect Ratio",
                  command: "npx shadcn-ui@latest add aspect-ratio",
                  usage: "<AspectRatio ratio={16 / 9}>Content</AspectRatio>",
                },
                {
                  name: "Breadcrumb",
                  command: "npx shadcn-ui@latest add breadcrumb",
                  usage:
                    "<Breadcrumb><BreadcrumbList>...</BreadcrumbList></Breadcrumb>",
                },
                {
                  name: "Carousel",
                  command: "npx shadcn-ui@latest add carousel",
                  usage:
                    "<Carousel><CarouselContent>...</CarouselContent></Carousel>",
                },
                {
                  name: "Collapsible",
                  command: "npx shadcn-ui@latest add collapsible",
                  usage:
                    "<Collapsible><CollapsibleTrigger>Toggle</CollapsibleTrigger></Collapsible>",
                },
                {
                  name: "Context Menu",
                  command: "npx shadcn-ui@latest add context-menu",
                  usage:
                    "<ContextMenu><ContextMenuTrigger>Right click</ContextMenuTrigger></ContextMenu>",
                },
                {
                  name: "Data Table",
                  command: "npx shadcn-ui@latest add data-table",
                  usage: "<DataTable columns={columns} data={data} />",
                },
                {
                  name: "Drawer",
                  command: "npx shadcn-ui@latest add drawer",
                  usage: "<Drawer><DrawerTrigger>Open</DrawerTrigger></Drawer>",
                },
                {
                  name: "Hover Card",
                  command: "npx shadcn-ui@latest add hover-card",
                  usage:
                    "<HoverCard><HoverCardTrigger>Hover</HoverCardTrigger></HoverCard>",
                },
                {
                  name: "Menubar",
                  command: "npx shadcn-ui@latest add menubar",
                  usage: "<Menubar><MenubarMenu>...</MenubarMenu></Menubar>",
                },
                {
                  name: "Navigation Menu",
                  command: "npx shadcn-ui@latest add navigation-menu",
                  usage:
                    "<NavigationMenu><NavigationMenuList>...</NavigationMenuList></NavigationMenu>",
                },
                {
                  name: "Pagination",
                  command: "npx shadcn-ui@latest add pagination",
                  usage:
                    "<Pagination><PaginationContent>...</PaginationContent></Pagination>",
                },
              ].map((component, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {component.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between bg-slate-900 text-green-400 p-2 rounded text-xs">
                      <code className="truncate">{component.command}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(component.command, `shadcn-${index}`)
                        }
                        className="text-green-400 hover:text-green-300 h-6 w-6 p-0"
                      >
                        {copiedCommand === `shadcn-${index}` ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-slate-100 p-2 rounded text-xs">
                      <code className="text-slate-700">{component.usage}</code>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Lucide Icons */}
          <TabsContent value="lucide" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">
              ⚡ Top 40 Icônes Lucide React
            </h2>

            <div className="mb-4">
              <CommandCard
                id="lucide-install"
                title="Installation"
                command="npm install lucide-react"
                description="Installe la librairie d'icônes Lucide pour React"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[
                "Home",
                "User",
                "Settings",
                "Search",
                "Menu",
                "X",
                "Plus",
                "Minus",
                "Edit",
                "Trash2",
                "Save",
                "Download",
                "Upload",
                "Mail",
                "Phone",
                "Calendar",
                "Clock",
                "Star",
                "Heart",
                "Eye",
                "EyeOff",
                "Lock",
                "Unlock",
                "Key",
                "Shield",
                "Alert",
                "Info",
                "Check",
                "ChevronDown",
                "ChevronUp",
                "ChevronLeft",
                "ChevronRight",
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                "ExternalLink",
                "Copy",
                "Share",
                "Filter",
              ].map((icon, index) => (
                <Card
                  key={index}
                  className="p-4 text-center hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-2xl">
                      {/* Ici vous pourriez importer et afficher l'icône réelle */}
                      <span className="text-slate-600">🔸</span>
                    </div>
                    <span className="text-sm font-medium">{icon}</span>
                    <div className="flex items-center justify-between bg-slate-900 text-green-400 p-1 rounded text-xs w-full">
                      <code className="truncate">{`<${icon} />`}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            `import { ${icon} } from 'lucide-react';\n<${icon} />`,
                            `lucide-${index}`
                          )
                        }
                        className="text-green-400 hover:text-green-300 h-5 w-5 p-0"
                      >
                        {copiedCommand === `lucide-${index}` ? (
                          <Check className="h-2 w-2" />
                        ) : (
                          <Copy className="h-2 w-2" />
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Exemple d'utilisation</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                  {`import { Search, User, Settings } from 'lucide-react';

function MyComponent() {
  return (
    <div className="flex items-center gap-4">
      <Search className="h-5 w-5 text-gray-500" />
      <User className="h-6 w-6 text-blue-500" />
      <Settings className="h-4 w-4 text-gray-400" />
    </div>
  );
}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Libraries */}
          <TabsContent value="libraries" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">
              📚 Top 20 Librairies React/Next.js
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "Zod",
                  command: "npm install zod",
                  description: "Validation de schémas TypeScript",
                  example: "const schema = z.string().email();",
                },
                {
                  name: "Zustand",
                  command: "npm install zustand",
                  description: "Gestionnaire d'état simple",
                  example: "const useStore = create((set) => ({ count: 0 }));",
                },
                {
                  name: "Lucide React",
                  command: "npm install lucide-react",
                  description: "Icônes SVG modernes",
                  example: "<Search className='h-4 w-4' />",
                },
                {
                  name: "React Hook Form",
                  command: "npm install react-hook-form",
                  description: "Gestion de formulaires performante",
                  example: "const { register, handleSubmit } = useForm();",
                },
                {
                  name: "Framer Motion",
                  command: "npm install framer-motion",
                  description: "Animations fluides",
                  example: "<motion.div animate={{ x: 100 }} />",
                },
                {
                  name: "React Query",
                  command: "npm install @tanstack/react-query",
                  description: "Gestion des données serveur",
                  example: "const { data } = useQuery('users', fetchUsers);",
                },
                {
                  name: "Tailwind CSS",
                  command: "npm install tailwindcss",
                  description: "Framework CSS utility-first",
                  example: "className='bg-blue-500 text-white p-4'",
                },
                {
                  name: "Next Auth",
                  command: "npm install next-auth",
                  description: "Authentification pour Next.js",
                  example: "import { signIn, signOut } from 'next-auth/react';",
                },
                {
                  name: "React DnD",
                  command: "npm install react-dnd",
                  description: "Drag and drop",
                  example: "const [{ isDragging }, drag] = useDrag();",
                },
                {
                  name: "React Router",
                  command: "npm install react-router-dom",
                  description: "Routage côté client",
                  example: "<Route path='/users' component={Users} />",
                },
                {
                  name: "Axios",
                  command: "npm install axios",
                  description: "Client HTTP",
                  example: "const response = await axios.get('/api/users');",
                },
                {
                  name: "Date-fns",
                  command: "npm install date-fns",
                  description: "Manipulation de dates",
                  example: "format(new Date(), 'yyyy-MM-dd')",
                },
                {
                  name: "React Hot Toast",
                  command: "npm install react-hot-toast",
                  description: "Notifications toast",
                  example: "toast.success('Success message!');",
                },
                {
                  name: "Recharts",
                  command: "npm install recharts",
                  description: "Graphiques React",
                  example:
                    "<LineChart data={data}><Line dataKey='value' /></LineChart>",
                },
                {
                  name: "React Helmet",
                  command: "npm install react-helmet",
                  description: "Gestion du head HTML",
                  example: "<Helmet><title>Page Title</title></Helmet>",
                },
                {
                  name: "Lodash",
                  command: "npm install lodash",
                  description: "Utilitaires JavaScript",
                  example: "import { debounce } from 'lodash';",
                },
                {
                  name: "Yup",
                  command: "npm install yup",
                  description: "Validation de schémas",
                  example: "const schema = yup.string().required();",
                },
                {
                  name: "React Select",
                  command: "npm install react-select",
                  description: "Composant select avancé",
                  example: "<Select options={options} isMulti />",
                },
                {
                  name: "React Virtualized",
                  command: "npm install react-virtualized",
                  description: "Rendu virtualisé",
                  example: "<List rowCount={1000} rowRenderer={rowRenderer} />",
                },
                {
                  name: "Styled Components",
                  command: "npm install styled-components",
                  description: "CSS-in-JS",
                  example: "const Button = styled.button`color: blue;`;",
                },
              ].map((lib, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{lib.name}</CardTitle>
                      <Badge variant="secondary">Library</Badge>
                    </div>
                    <CardDescription>{lib.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between bg-slate-900 text-green-400 p-2 rounded text-sm">
                      <code>{lib.command}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(lib.command, `lib-${index}`)
                        }
                        className="text-green-400 hover:text-green-300 h-6 w-6 p-0"
                      >
                        {copiedCommand === `lib-${index}` ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-slate-100 p-2 rounded text-sm">
                      <code className="text-slate-700">{lib.example}</code>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* PowerShell Commands */}
          <TabsContent value="powershell" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">
              💻 Top 10 Commandes PowerShell
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <CommandCard
                  id="ps-tree"
                  title="Afficher l'arborescence"
                  command="tree /f"
                  description="Affiche la structure complète d'un dossier avec tous les fichiers"
                />

                <CommandCard
                  id="ps-test-path"
                  title="Tester l'existence d'un fichier"
                  command="Test-Path -Path 'C:\path\to\file.txt'"
                  description="Vérifie si un fichier ou dossier existe"
                />

                <CommandCard
                  id="ps-new-item"
                  title="Créer un fichier/dossier"
                  command="New-Item -Path 'C:\temp\newfile.txt' -ItemType File"
                  description="Crée un nouveau fichier ou dossier"
                />

                <CommandCard
                  id="ps-get-childitem"
                  title="Lister les fichiers"
                  command="Get-ChildItem -Path 'C:\' -Recurse"
                  description="Liste tous les fichiers et dossiers récursivement"
                />

                <CommandCard
                  id="ps-copy-item"
                  title="Copier des fichiers"
                  command="Copy-Item -Path 'source.txt' -Destination 'destination.txt'"
                  description="Copie un fichier vers un autre emplacement"
                />
              </div>

              <div className="space-y-4">
                <CommandCard
                  id="ps-remove-item"
                  title="Supprimer des fichiers"
                  command="Remove-Item -Path 'C:\temp\file.txt' -Force"
                  description="Supprime un fichier ou dossier"
                />

                <CommandCard
                  id="ps-get-process"
                  title="Lister les processus"
                  command="Get-Process | Sort-Object CPU -Descending"
                  description="Affiche tous les processus triés par utilisation CPU"
                />

                <CommandCard
                  id="ps-get-service"
                  title="Gérer les services"
                  command="Get-Service | Where-Object {$_.Status -eq 'Running'}"
                  description="Liste tous les services en cours d'exécution"
                />

                <CommandCard
                  id="ps-get-content"
                  title="Lire un fichier"
                  command="Get-Content -Path 'C:\logs\app.log' -Tail 10"
                  description="Lit les 10 dernières lignes d'un fichier"
                />

                <CommandCard
                  id="ps-set-location"
                  title="Changer de répertoire"
                  command="Set-Location -Path 'C:\Projects\MyApp'"
                  description="Change le répertoire de travail actuel"
                />
              </div>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Script PowerShell utile</CardTitle>
                <CardDescription>
                  Créer un fichier seulement s'il n'existe pas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-slate-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                  {`# Script pour créer un fichier seulement s'il n'existe pas
$FilePath = "C:\\temp\\myfile.txt"

if (-not (Test-Path $FilePath)) {
    New-Item -Path $FilePath -ItemType File
    Write-Host "Fichier créé: $FilePath" -ForegroundColor Green
} else {
    Write-Host "Le fichier existe déjà: $FilePath" -ForegroundColor Yellow
}

# Obtenir l'arborescence et la sauvegarder
tree /f > arborescence.txt
Write-Host "Arborescence sauvegardée dans arborescence.txt"`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
