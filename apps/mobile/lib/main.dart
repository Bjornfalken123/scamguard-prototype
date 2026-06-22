import 'package:flutter/material.dart';

void main() => runApp(const ScamGuardApp());

class ScamGuardApp extends StatelessWidget {
  const ScamGuardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ScamGuard',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.indigo),
      home: const HomeShell(),
    );
  }
}

class HomeShell extends StatefulWidget {
  const HomeShell({super.key});

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int index = 0;
  final pages = const [DashboardPage(), CallsPage(), FamilyPage(), SettingsPage()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(child: pages[index]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: (value) => setState(() => index = value),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.shield_outlined), selectedIcon: Icon(Icons.shield), label: 'Skydd'),
          NavigationDestination(icon: Icon(Icons.call_outlined), selectedIcon: Icon(Icons.call), label: 'Samtal'),
          NavigationDestination(icon: Icon(Icons.family_restroom_outlined), selectedIcon: Icon(Icons.family_restroom), label: 'Anhöriga'),
          NavigationDestination(icon: Icon(Icons.settings_outlined), selectedIcon: Icon(Icons.settings), label: 'Inställningar'),
        ],
      ),
    );
  }
}

class DashboardPage extends StatelessWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(20),
      children: [
        Text('ScamGuard', style: Theme.of(context).textTheme.headlineLarge?.copyWith(fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        const Text('AI-skydd för okända samtal', style: TextStyle(fontSize: 18)),
        const SizedBox(height: 24),
        const StatusCard(),
        const SizedBox(height: 16),
        FilledButton.icon(
          onPressed: () {},
          icon: const Icon(Icons.phone_forwarded),
          label: const Padding(padding: EdgeInsets.all(14), child: Text('Aktivera vidarekoppling', style: TextStyle(fontSize: 18))),
        ),
        const SizedBox(height: 16),
        const InfoCard(title: 'Så fungerar det', text: 'Okända samtal går först till ScamGuard. AI:n frågar vad samtalet gäller och stoppar misstänkta bedrägerier innan de når senioren.'),
      ],
    );
  }
}

class StatusCard extends StatelessWidget {
  const StatusCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(22),
        child: Row(
          children: [
            Icon(Icons.verified_user, size: 52, color: Theme.of(context).colorScheme.primary),
            const SizedBox(width: 18),
            const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Skydd aktivt', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
              SizedBox(height: 6),
              Text('Okända samtal screenas innan de kopplas fram.'),
            ])),
          ],
        ),
      ),
    );
  }
}

class CallsPage extends StatelessWidget {
  const CallsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final calls = [
      ('+46 8 123 456', 'Hög risk', 'Bad om BankID och skapade tidspress', Icons.block),
      ('+46 70 111 11 11', 'Tryggt', 'Betrodd kontakt kopplades fram', Icons.check_circle),
      ('+46 31 555 010', 'Granska', 'Oklart ärende, stoppades för säkerhets skull', Icons.warning),
    ];
    return ListView(padding: const EdgeInsets.all(20), children: [
      Text('Senaste samtal', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
      const SizedBox(height: 16),
      for (final c in calls) Card(child: ListTile(leading: Icon(c.$4), title: Text(c.$1), subtitle: Text(c.$3), trailing: Text(c.$2))),
    ]);
  }
}

class FamilyPage extends StatelessWidget {
  const FamilyPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(padding: const EdgeInsets.all(20), children: const [
      Text('Anhöriga', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
      SizedBox(height: 16),
      Card(child: ListTile(leading: Icon(Icons.person), title: Text('Björn'), subtitle: Text('Får varningar vid hög risk'))),
      Card(child: ListTile(leading: Icon(Icons.add), title: Text('Lägg till anhörig'))),
    ]);
  }
}

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(padding: const EdgeInsets.all(20), children: [
      Text('Inställningar', style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold)),
      const SizedBox(height: 16),
      SwitchListTile(value: true, onChanged: (_) {}, title: const Text('Skydd aktivt'), subtitle: const Text('Screenar okända samtal')),
      SwitchListTile(value: true, onChanged: (_) {}, title: const Text('Varna anhörig'), subtitle: const Text('Vid hög risk skickas varning')),
      const ListTile(leading: Icon(Icons.security), title: Text('Skyddsnivå'), subtitle: Text('Standard')),
      const ListTile(leading: Icon(Icons.cloud), title: Text('Backend'), subtitle: Text('Ej kopplad i prototypen')),
    ]);
  }
}

class InfoCard extends StatelessWidget {
  final String title;
  final String text;
  const InfoCard({required this.title, required this.text, super.key});

  @override
  Widget build(BuildContext context) {
    return Card(child: Padding(padding: const EdgeInsets.all(18), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)), const SizedBox(height: 8), Text(text)])));
  }
}
