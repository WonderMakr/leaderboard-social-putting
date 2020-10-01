-- phpMyAdmin SQL Dump
-- version 4.9.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Oct 01, 2020 at 11:49 PM
-- Server version: 5.7.26
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `leaderboard_sp`
--
CREATE DATABASE IF NOT EXISTS `leaderboard_sp` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `leaderboard_sp`;

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `game_type_id` int(3) NOT NULL,
  `current_player_id` int(11) NOT NULL DEFAULT '0',
  `winner_id` int(11) NOT NULL DEFAULT '0',
  `status` enum('in_progress','incomplete','completed') NOT NULL,
  `player_count` int(11) NOT NULL DEFAULT '0',
  `current_round` int(11) NOT NULL DEFAULT '1',
  `current_ball` int(11) NOT NULL DEFAULT '1',
  `created_at` int(11) NOT NULL DEFAULT '0',
  `updated_at` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `game_data`
--

CREATE TABLE `game_data` (
  `id` int(11) UNSIGNED NOT NULL,
  `meta_data` varchar(150) NOT NULL,
  `meta_value` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `game_data`
--

INSERT INTO `game_data` (`id`, `meta_data`, `meta_value`) VALUES
(1, 'credits', '5'),
(2, 'payment', 'credits');

-- --------------------------------------------------------

--
-- Table structure for table `game_types`
--

CREATE TABLE `game_types` (
  `id` int(2) UNSIGNED NOT NULL,
  `game` varchar(100) NOT NULL,
  `slug` varchar(10) NOT NULL,
  `active` tinyint(1) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `game_types`
--

INSERT INTO `game_types` (`id`, `game`, `slug`, `active`) VALUES
(1, 'Six Hole Challenge', 'six-hole', 1),
(2, 'Mark It Zero', 'mark-0', 1),
(3, 'Lights Out', 'lights-out', 1);

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `score` int(11) NOT NULL DEFAULT '0',
  `created_at` int(11) NOT NULL DEFAULT '0',
  `updated_at` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game_data`
--
ALTER TABLE `game_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `game_types`
--
ALTER TABLE `game_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `game_data`
--
ALTER TABLE `game_data`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `game_types`
--
ALTER TABLE `game_types`
  MODIFY `id` int(2) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
