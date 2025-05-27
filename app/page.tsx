// app/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle,
  Users,
  BarChart3,
  MessageSquare,
  Clock,
  Shield,
  Zap,
  Star,
  Play,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Users,
      title: "Gestion d'équipes avancée",
      description:
        "Organisez vos équipes par type (organisation, service, projet) avec des rôles granulaires et des permissions personnalisées.",
      highlight: "Relations many-to-many",
    },
    {
      icon: BarChart3,
      title: "Méthodologie Agile complète",
      description:
        "Features hiérarchiques, User Stories, Sprints et tâches avec suivi du temps intégré pour une gestion agile optimale.",
      highlight: "Hiérarchies complexes",
    },
    {
      icon: MessageSquare,
      title: "Collaboration en temps réel",
      description:
        "Commentaires hiérarchiques sur tous les éléments, notifications intelligentes et système de mentions avancé.",
      highlight: "Commentaires polymorphes",
    },
    {
      icon: Shield,
      title: "Sécurité & authentification",
      description:
        "Authentification multi-provider avec Better Auth, sessions sécurisées et audit complet des activités.",
      highlight: "Better Auth intégré",
    },
    {
      icon: Zap,
      title: "Schémas de données flexibles",
      description:
        "Créez des structures de données personnalisées par projet avec notre système de schémas dynamiques unique.",
      highlight: "Innovation exclusive",
    },
    {
      icon: Clock,
      title: "Suivi et reporting",
      description:
        "TimeLog automatique, rapports détaillés et analytics pour optimiser la productivité de vos équipes.",
      highlight: "Analytics avancées",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Martin",
      role: "Chef de projet chez TechCorp",
      content:
        "La hiérarchie des features et user stories nous a permis d'organiser nos projets complexes de façon intuitive. Le système de schémas personnalisés est révolutionnaire !",
      rating: 5,
    },
    {
      name: "Marc Dubois",
      role: "Scrum Master chez InnovLab",
      content:
        "L'intégration des sprints avec le suivi du temps et les commentaires hiérarchiques a transformé notre façon de travailler. Plus besoin de jongler entre plusieurs outils.",
      rating: 5,
    },
    {
      name: "Julie Chen",
      role: "Product Owner chez StartupXYZ",
      content:
        "Le système de rôles granulaires et la gestion des équipes par type nous permet de gérer efficacement nos 50+ collaborateurs sur 15 projets simultanés.",
      rating: 5,
    },
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "0€",
      period: "Gratuit",
      description: "Parfait pour les petites équipes",
      features: [
        "Jusqu'à 5 utilisateurs",
        "3 projets maximum",
        "Fonctionnalités de base",
        "Support communautaire",
      ],
      cta: "Commencer gratuitement",
      popular: false,
    },
    {
      name: "Professional",
      price: "29€",
      period: "/mois",
      description: "Pour les équipes en croissance",
      features: [
        "Utilisateurs illimités",
        "Projets illimités",
        "Schémas personnalisés",
        "Analytics avancées",
        "Support prioritaire",
      ],
      cta: "Essai gratuit 14 jours",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Sur devis",
      period: "Personnalisé",
      description: "Pour les grandes organisations",
      features: [
        "Tout de Professional",
        "SSO et sécurité avancée",
        "API personnalisée",
        "Support dédié",
        "Formation incluse",
      ],
      cta: "Nous contacter",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <Link href="/auth/register">
          <Button variant="outline">Essai gratuit</Button>
        </Link>
        <Link href="/demo">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Voir la démo
          </Button>
        </Link>
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
              🚀 Nouveau : Schémas de données personnalisables
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              La gestion de projets
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                agile réinventée
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Organisez vos équipes, gérez vos projets et collaborez
              efficacement avec notre plateforme complète basée sur une
              architecture de données avancée. Features hiérarchiques, user
              stories, sprints et bien plus.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4"
                >
                  Commencer gratuitement
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>

              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Voir la démo
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Essai gratuit 14 jours</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Aucune carte requise</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Support inclus</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités avancées pour équipes modernes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre architecture de données sophistiquée permet des
              fonctionnalités uniques que vous ne trouverez nulle part ailleurs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md"
                >
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl mb-2">
                      {feature.title}
                    </CardTitle>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {feature.highlight}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez pourquoi plus de 10,000 équipes choisissent ProjectFlow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tarifs transparents pour toutes les équipes
            </h2>
            <p className="text-xl text-gray-600">
              Commencez gratuitement, évoluez selon vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 ${plan.popular ? "border-blue-500 shadow-lg" : "border-gray-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">
                      Plus populaire
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à transformer votre gestion de projets ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers d'équipes qui utilisent déjà ProjectFlow pour
            leurs projets agiles
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/auth/register">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-4"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
              >
                Parler à un expert
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
