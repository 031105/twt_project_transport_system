-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 24, 2025 at 04:12 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `TWT_Transport_System`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `booking_reference` varchar(20) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `trip_id` char(36) NOT NULL,
  `booking_status` enum('pending','confirmed','cancelled','completed','no_show','refunded','expired') DEFAULT 'pending',
  `payment_status` enum('pending','paid','failed','refunded','partially_refunded') DEFAULT 'pending',
  `total_amount` decimal(10,2) NOT NULL,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `tax_amount` decimal(10,2) DEFAULT 0.00,
  `service_fee` decimal(10,2) DEFAULT 0.00,
  `currency` varchar(3) DEFAULT 'MYR',
  `booking_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `travel_date` date NOT NULL,
  `passenger_count` int(11) NOT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `special_requests` text DEFAULT NULL,
  `source_platform` varchar(50) DEFAULT 'web',
  `booking_agent_id` char(36) DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `cancelled_by` char(36) DEFAULT NULL,
  `refund_amount` decimal(10,2) DEFAULT NULL,
  `refund_processed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `booking_reference`, `user_id`, `trip_id`, `booking_status`, `payment_status`, `total_amount`, `discount_amount`, `tax_amount`, `service_fee`, `currency`, `booking_date`, `travel_date`, `passenger_count`, `contact_email`, `contact_phone`, `special_requests`, `source_platform`, `booking_agent_id`, `cancellation_reason`, `cancelled_at`, `cancelled_by`, `refund_amount`, `refund_processed_at`, `created_at`, `updated_at`) VALUES
('130e8400-e29b-41d4-a716-446655440001', 'TWT20241201001', '550e8400-e29b-41d4-a716-446655440010', '110e8400-e29b-41d4-a716-446655440001', 'confirmed', 'paid', 67.50, 0.00, 4.05, 3.00, 'MYR', '2024-12-01 06:30:00', '2025-06-25', 1, 'john.doe@email.com', '+60187654321', NULL, 'web', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-12 05:16:53', '2025-06-14 14:51:45'),
('130e8400-e29b-41d4-a716-446655440002', 'TWT20241202001', '550e8400-e29b-41d4-a716-446655440011', '110e8400-e29b-41d4-a716-446655440001', 'confirmed', 'paid', 67.50, 6.75, 3.64, 3.00, 'MYR', '2024-12-02 01:15:00', '2025-06-25', 1, 'jane.smith@email.com', '+60198765432', NULL, 'mobile', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-12 05:16:53', '2025-06-14 14:51:45'),
('130e8400-e29b-41d4-a716-446655440003', 'TWT20241203001', '550e8400-e29b-41d4-a716-446655440012', '110e8400-e29b-41d4-a716-446655440007', 'confirmed', 'paid', 50.00, 0.00, 3.00, 2.50, 'MYR', '2024-12-03 08:45:00', '2025-06-25', 2, 'ahmad.hassan@email.com', '+60176543210', NULL, 'web', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-12 05:16:53', '2025-06-14 14:51:45'),
('130e8400-e29b-41d4-a716-446655440004', 'TWT20241204001', '550e8400-e29b-41d4-a716-446655440013', '110e8400-e29b-41d4-a716-446655440005', 'pending', 'pending', 55.00, 0.00, 3.30, 2.75, 'MYR', '2024-12-04 03:20:00', '2025-06-25', 1, 'siti.nurhaliza@email.com', '+60134567890', NULL, 'web', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-12 05:16:53', '2025-06-14 14:51:45'),
('130e8400-e29b-41d4-a716-446655440005', 'TWT20241205001', '550e8400-e29b-41d4-a716-446655440014', '110e8400-e29b-41d4-a716-446655440009', 'confirmed', 'paid', 23.00, 2.00, 1.26, 1.15, 'MYR', '2024-12-05 00:30:00', '2025-06-28', 1, 'raj.kumar@email.com', '+60145678901', NULL, 'mobile', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-12 05:16:53', '2025-06-14 14:51:45'),
('130e8400-e29b-41d4-a716-446655440006', 'TWT20241206001', '550e8400-e29b-41d4-a716-446655440015', '110e8400-e29b-41d4-a716-446655440003', 'cancelled', 'refunded', 45.00, 0.00, 2.70, 2.25, 'MYR', '2024-12-06 00:00:00', '2025-06-26', 1, 'lim.mei.ling@email.com', '+60156789012', NULL, 'web', NULL, 'personal_emergency', '2024-12-06 06:30:00', NULL, NULL, NULL, '2025-06-12 05:22:39', '2025-06-14 14:51:45'),
('130e8400-e29b-41d4-a716-446655440007', 'TWT20241120001', '550e8400-e29b-41d4-a716-446655440012', '110e8400-e29b-41d4-a716-446655440010', 'completed', 'paid', 20.00, 2.00, 1.08, 1.00, 'MYR', '2024-11-20 08:00:00', '2024-11-29', 1, 'ahmad.hassan@email.com', '+60176543210', NULL, 'mobile', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-12 05:22:39', '2025-06-12 05:22:39'),
('130e8400-e29b-41d4-a716-446655440008', 'TWT20241207001', '550e8400-e29b-41d4-a716-446655440014', '110e8400-e29b-41d4-a716-446655440004', 'expired', 'failed', 45.00, 0.00, 2.70, 2.25, 'MYR', '2024-12-07 02:00:00', '2025-06-26', 1, 'raj.kumar@email.com', '+60145678901', NULL, 'web', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-12 05:22:39', '2025-06-14 14:51:45'),
('986af403-4375-4457-862d-fa49d4b15b76', 'TBS202506247664', '550e8400-e29b-41d4-a716-446655440010', '110e8400-e29b-41d4-a716-446655440001', 'confirmed', 'paid', 45.00, 0.00, 0.00, 0.00, 'MYR', '2025-06-23 09:36:14', '2025-06-25', 1, 'john.doe@email.com', '82838492947', NULL, 'web', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-23 09:36:14', '2025-06-23 09:36:14'),
('990ac9bf-a854-40cd-99e9-8bbd77e25073', 'TBS202506248343', 'a26b3d63-92dd-4c97-917d-cd8cdaf9993d', '110e8400-e29b-41d4-a716-446655440001', 'confirmed', 'paid', 67.50, 0.00, 0.00, 0.00, 'MYR', '2025-06-17 14:52:26', '2025-06-25', 1, 'admin@transportbooking.com', '016562892', NULL, 'web', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-17 14:52:26', '2025-06-17 14:52:26'),
('c92e67de-7a03-4d73-be29-51d3d67170a7', 'TBS202506243783', '550e8400-e29b-41d4-a716-446655440010', '110e8400-e29b-41d4-a716-446655440001', 'confirmed', 'paid', 45.00, 0.00, 0.00, 0.00, 'MYR', '2025-06-23 14:50:54', '2025-06-25', 1, 'john.doe@email.com', '472987842', NULL, 'web', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-23 14:50:54', '2025-06-23 14:50:54'),
('d6358d60-8ae4-4164-844f-9143ba58ea67', 'TBS202506245564', 'a26b3d63-92dd-4c97-917d-cd8cdaf9993d', '110e8400-e29b-41d4-a716-446655440001', 'confirmed', 'paid', 45.00, 0.00, 0.00, 0.00, 'MYR', '2025-06-23 05:00:07', '2025-06-25', 1, 'admin@transportbooking.com', '8192748278', NULL, 'web', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-23 05:00:07', '2025-06-23 05:00:07'),
('dc2fff47-b72f-4e8b-bdfb-fb124efb398c', 'TBS202506243607', '550e8400-e29b-41d4-a716-446655440010', '110e8400-e29b-41d4-a716-446655440001', 'confirmed', 'paid', 45.00, 0.00, 0.00, 0.00, 'MYR', '2025-06-23 09:39:57', '2025-06-25', 1, 'john.doe@email.com', '424242422', NULL, 'web', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-23 09:39:57', '2025-06-23 09:39:57');

-- --------------------------------------------------------

--
-- Table structure for table `email_verifications`
--

CREATE TABLE `email_verifications` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) DEFAULT NULL,
  `email` varchar(320) NOT NULL,
  `otp_code` varchar(6) NOT NULL,
  `purpose` enum('signup_verification','password_reset') NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `verified_at` timestamp NULL DEFAULT NULL,
  `attempts` int(11) DEFAULT 0,
  `max_attempts` int(11) DEFAULT 3,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_verifications`
--

INSERT INTO `email_verifications` (`id`, `user_id`, `email`, `otp_code`, `purpose`, `expires_at`, `verified_at`, `attempts`, `max_attempts`, `created_at`) VALUES
('dc23ad00-5010-11f0-992b-6ea21d1b473f', '1a9c47b3-b702-43c7-9506-ef770a6afd9c', 'gsd.personal031105v@gmail.com', '760494', 'signup_verification', '2025-06-23 09:03:17', '2025-06-23 09:03:17', 0, 3, '2025-06-23 09:02:59');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(100) NOT NULL,
  `code` varchar(10) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT 'Malaysia',
  `address` text DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `timezone` varchar(50) DEFAULT 'Asia/Kuala_Lumpur',
  `facilities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`facilities`)),
  `operating_hours` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`operating_hours`)),
  `contact_phone` varchar(20) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `terminal_type` varchar(20) DEFAULT 'bus_terminal',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `code`, `city`, `state`, `country`, `address`, `postal_code`, `latitude`, `longitude`, `timezone`, `facilities`, `operating_hours`, `contact_phone`, `contact_email`, `is_active`, `terminal_type`, `created_at`) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'KL Sentral Terminal', 'KLST', 'Kuala Lumpur', 'Federal Territory', 'Malaysia', 'KL Sentral Station, 50470 Kuala Lumpur', '50470', 3.13370000, 101.68610000, 'Asia/Kuala_Lumpur', '{\"parking\": true, \"restroom\": true, \"food_court\": true, \"wifi\": true, \"atm\": true}', '{\"daily\": {\"open\": \"05:00\", \"close\": \"24:00\"}}', '+603-2274-3333', 'info@klsentral.com.my', 1, 'bus_terminal', '2025-06-12 05:16:44'),
('770e8400-e29b-41d4-a716-446655440002', 'Terminal Bersepadu Selatan JB', 'TBSJ', 'Johor Bahru', 'Johor', 'Malaysia', 'Jalan Tun Abdul Razak, 80000 Johor Bahru', '80000', 1.48540000, 103.76180000, 'Asia/Kuala_Lumpur', '{\"parking\": true, \"restroom\": true, \"food_court\": true, \"wifi\": true, \"currency_exchange\": true}', '{\"daily\": {\"open\": \"04:30\", \"close\": \"24:30\"}}', '+607-236-8888', 'contact@tbsjb.com.my', 1, 'bus_terminal', '2025-06-12 05:16:44'),
('770e8400-e29b-41d4-a716-446655440003', 'Komtar Bus Terminal', 'KBTP', 'George Town', 'Penang', 'Malaysia', 'Jalan Dr Lim Chwee Leong, 10000 George Town', '10000', 5.41640000, 100.33270000, 'Asia/Kuala_Lumpur', '{\"parking\": true, \"restroom\": true, \"food_court\": true, \"wifi\": true}', '{\"daily\": {\"open\": \"05:00\", \"close\": \"23:30\"}}', '+604-261-9999', 'info@komtar.com.my', 1, 'bus_terminal', '2025-06-12 05:16:44'),
('770e8400-e29b-41d4-a716-446655440004', 'Melaka Sentral', 'MLKS', 'Malacca City', 'Malacca', 'Malaysia', 'Jalan Tun Razak, 75400 Melaka', '75400', 2.18960000, 102.25010000, 'Asia/Kuala_Lumpur', '{\"parking\": true, \"restroom\": true, \"food_court\": true, \"wifi\": false, \"souvenir_shop\": true}', '{\"daily\": {\"open\": \"05:30\", \"close\": \"23:00\"}}', '+606-288-1234', 'enquiry@melakasentral.com.my', 1, 'bus_terminal', '2025-06-12 05:16:44'),
('770e8400-e29b-41d4-a716-446655440005', 'Terminal Amanjaya Ipoh', 'TAIP', 'Ipoh', 'Perak', 'Malaysia', 'Jalan Ampang, 30200 Ipoh', '30200', 4.59750000, 101.09010000, 'Asia/Kuala_Lumpur', '{\"parking\": true, \"restroom\": true, \"food_court\": true, \"wifi\": true}', '{\"daily\": {\"open\": \"05:00\", \"close\": \"23:00\"}}', '+605-254-7777', 'info@amanjaya.com.my', 1, 'bus_terminal', '2025-06-12 05:16:44'),
('770e8400-e29b-41d4-a716-446655440006', 'Seremban Terminal', 'SRMB', 'Seremban', 'Negeri Sembilan', 'Malaysia', 'Jalan Sungai Ujong, 70200 Seremban', '70200', 2.72970000, 101.93810000, 'Asia/Kuala_Lumpur', '{\"parking\": true, \"restroom\": true, \"food_court\": false, \"wifi\": false}', '{\"daily\": {\"open\": \"06:00\", \"close\": \"22:00\"}}', '+606-763-5555', 'contact@serembanbus.com.my', 1, 'bus_terminal', '2025-06-12 05:16:44'),
('770e8400-e29b-41d4-a716-446655440007', 'Genting Highlands Terminal', 'GHTS', 'Genting Highlands', 'Pahang', 'Malaysia', 'Genting Highlands Resort, 69000 Genting Highlands', '69000', 3.42130000, 101.79360000, 'Asia/Kuala_Lumpur', '{\"parking\": true, \"restroom\": true, \"food_court\": true, \"wifi\": true, \"tourist_info\": true}', '{\"daily\": {\"open\": \"06:00\", \"close\": \"22:00\"}}', '+609-101-1118', 'transport@genting.com.my', 1, 'bus_terminal', '2025-06-12 05:16:44'),
('770e8400-e29b-41d4-a716-446655440008', 'Kuantan Central Terminal', 'KCTN', 'Kuantan', 'Pahang', 'Malaysia', 'Jalan Stadium, 25000 Kuantan', '25000', 3.80770000, 103.32600000, 'Asia/Kuala_Lumpur', '{\"parking\": true, \"restroom\": true, \"food_court\": true, \"wifi\": false}', '{\"daily\": {\"open\": \"05:30\", \"close\": \"23:30\"}}', '+609-515-2222', 'info@kuantancentral.com.my', 1, 'bus_terminal', '2025-06-12 05:16:44');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `booking_id` char(36) NOT NULL,
  `payment_intent_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(3) DEFAULT 'MYR',
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_gateway` varchar(50) DEFAULT NULL,
  `payment_gateway_fee` decimal(8,2) DEFAULT 0.00,
  `transaction_id` varchar(255) DEFAULT NULL,
  `gateway_transaction_id` varchar(255) DEFAULT NULL,
  `card_last_four` varchar(4) DEFAULT NULL,
  `card_brand` varchar(20) DEFAULT NULL,
  `gateway_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gateway_response`)),
  `status` enum('pending','processing','completed','failed','cancelled','refunded','disputed') DEFAULT 'pending',
  `failure_reason` text DEFAULT NULL,
  `risk_score` int(11) DEFAULT NULL,
  `processed_at` timestamp NULL DEFAULT NULL,
  `refund_deadline` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `booking_id`, `payment_intent_id`, `amount`, `currency`, `payment_method`, `payment_gateway`, `payment_gateway_fee`, `transaction_id`, `gateway_transaction_id`, `card_last_four`, `card_brand`, `gateway_response`, `status`, `failure_reason`, `risk_score`, `processed_at`, `refund_deadline`, `created_at`) VALUES
('150e8400-e29b-41d4-a716-446655440001', '130e8400-e29b-41d4-a716-446655440001', NULL, 67.50, 'MYR', 'credit_card', 'stripe', 0.00, 'TXN_20241201_001', 'pi_1234567890abcdef', '4242', 'Visa', NULL, 'completed', NULL, NULL, '2024-12-01 06:32:15', NULL, '2025-06-12 05:16:53'),
('150e8400-e29b-41d4-a716-446655440002', '130e8400-e29b-41d4-a716-446655440002', NULL, 67.50, 'MYR', 'ewallet', 'grabpay', 0.00, 'TXN_20241202_001', 'GP_9876543210fedcba', NULL, NULL, NULL, 'completed', NULL, NULL, '2024-12-02 01:17:30', NULL, '2025-06-12 05:16:53'),
('150e8400-e29b-41d4-a716-446655440003', '130e8400-e29b-41d4-a716-446655440003', NULL, 50.00, 'MYR', 'credit_card', 'stripe', 0.00, 'TXN_20241203_001', 'pi_abcdef1234567890', '1234', 'Mastercard', NULL, 'completed', NULL, NULL, '2024-12-03 08:47:22', NULL, '2025-06-12 05:16:53'),
('150e8400-e29b-41d4-a716-446655440005', '130e8400-e29b-41d4-a716-446655440005', NULL, 23.00, 'MYR', 'debit_card', 'stripe', 0.00, 'TXN_20241205_001', 'pi_567890abcdef1234', '5678', 'Visa', NULL, 'completed', NULL, NULL, '2024-12-05 00:32:45', NULL, '2025-06-12 05:16:53'),
('150e8400-e29b-41d4-a716-446655440006', '130e8400-e29b-41d4-a716-446655440006', NULL, 45.00, 'MYR', 'bank_transfer', 'ipay88', 0.00, 'TXN_20241206_001', 'BT_1234567890abcdef', NULL, NULL, NULL, 'completed', NULL, NULL, '2024-12-06 00:05:00', NULL, '2025-06-12 05:22:39'),
('150e8400-e29b-41d4-a716-446655440007', '130e8400-e29b-41d4-a716-446655440007', NULL, 20.00, 'MYR', 'ewallet', 'tng', 0.00, 'TXN_20241120_001', 'TNG_abcdef1234567890', NULL, NULL, NULL, 'completed', NULL, NULL, '2024-11-20 08:02:30', NULL, '2025-06-12 05:22:39'),
('150e8400-e29b-41d4-a716-446655440008', '130e8400-e29b-41d4-a716-446655440008', NULL, 45.00, 'MYR', 'credit_card', 'stripe', 0.00, 'TXN_20241207_001', 'pi_failed123456789', '1234', 'Visa', NULL, 'failed', 'insufficient_funds', NULL, NULL, NULL, '2025-06-12 05:22:39');

-- --------------------------------------------------------

--
-- Table structure for table `routes`
--

CREATE TABLE `routes` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `route_code` varchar(20) NOT NULL,
  `name` varchar(200) NOT NULL,
  `origin_id` char(36) NOT NULL,
  `destination_id` char(36) NOT NULL,
  `distance_km` decimal(8,2) DEFAULT NULL,
  `estimated_duration_minutes` int(11) DEFAULT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `route_type` varchar(20) DEFAULT 'regular',
  `toll_charges` decimal(8,2) DEFAULT 0.00,
  `fuel_cost_estimate` decimal(8,2) DEFAULT NULL,
  `average_speed_kmh` decimal(5,2) DEFAULT NULL,
  `difficulty_level` varchar(20) DEFAULT 'easy',
  `scenic_rating` int(11) DEFAULT 3,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `routes`
--

INSERT INTO `routes` (`id`, `route_code`, `name`, `origin_id`, `destination_id`, `distance_km`, `estimated_duration_minutes`, `base_price`, `route_type`, `toll_charges`, `fuel_cost_estimate`, `average_speed_kmh`, `difficulty_level`, `scenic_rating`, `is_active`, `created_at`) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'KL-JB-001', 'KL - Johor Bahru Express', '770e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', 350.50, 300, 45.00, 'express', 18.00, 52.00, 70.00, 'easy', 3, 1, '2025-06-12 05:16:44'),
('aa0e8400-e29b-41d4-a716-446655440002', 'KL-PG-001', 'KL - Penang Highway', '770e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440003', 365.20, 240, 55.00, 'express', 22.00, 58.00, 75.00, 'easy', 3, 1, '2025-06-12 05:16:44'),
('aa0e8400-e29b-41d4-a716-446655440003', 'KL-MLK-001', 'KL - Malacca Direct', '770e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440004', 147.30, 150, 25.00, 'regular', 8.50, 28.00, 65.00, 'easy', 3, 1, '2025-06-12 05:16:44'),
('aa0e8400-e29b-41d4-a716-446655440004', 'IP-KTN-001', 'Ipoh - Kuantan Cross Route', '770e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440008', 285.70, 210, 40.00, 'regular', 15.00, 45.00, 68.00, 'easy', 3, 1, '2025-06-12 05:16:44'),
('aa0e8400-e29b-41d4-a716-446655440005', 'KL-GT-001', 'KL - Genting Express', '770e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440007', 58.20, 90, 20.00, 'tourist', 5.50, 18.00, 45.00, 'easy', 3, 1, '2025-06-12 05:16:44');

-- --------------------------------------------------------

--
-- Table structure for table `route_stops`
--

CREATE TABLE `route_stops` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `route_id` char(36) NOT NULL,
  `location_id` char(36) NOT NULL,
  `stop_order` int(11) NOT NULL,
  `arrival_offset_minutes` int(11) DEFAULT NULL,
  `departure_offset_minutes` int(11) DEFAULT NULL,
  `price_from_origin` decimal(8,2) DEFAULT NULL,
  `distance_from_origin_km` decimal(8,2) DEFAULT NULL,
  `boarding_allowed` tinyint(1) DEFAULT 1,
  `alighting_allowed` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `route_stops`
--

INSERT INTO `route_stops` (`id`, `route_id`, `location_id`, `stop_order`, `arrival_offset_minutes`, `departure_offset_minutes`, `price_from_origin`, `distance_from_origin_km`, `boarding_allowed`, `alighting_allowed`) VALUES
('rs-1749916145664-5eiu7u', 'aa0e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440005', 1, 120, 135, 20.00, 205.00, 1, 1),
('rs-1749916145664-lujhki', 'aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440006', 1, 90, 100, 15.00, 65.00, 1, 1),
('rs-1749916145664-o7hh53', 'aa0e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440006', 1, 60, 70, 12.00, 65.00, 1, 1),
('rs-1749916145664-vcnc1y', 'aa0e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440004', 2, 150, 165, 25.00, 147.00, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

CREATE TABLE `schedules` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `route_id` char(36) NOT NULL,
  `vehicle_type_id` char(36) DEFAULT NULL,
  `schedule_name` varchar(100) DEFAULT NULL,
  `departure_time` time NOT NULL,
  `arrival_time` time DEFAULT NULL,
  `days_of_week` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`days_of_week`)),
  `effective_from` date DEFAULT NULL,
  `effective_until` date DEFAULT NULL,
  `frequency` varchar(20) DEFAULT 'daily',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `schedules`
--

INSERT INTO `schedules` (`id`, `route_id`, `vehicle_type_id`, `schedule_name`, `departure_time`, `arrival_time`, `days_of_week`, `effective_from`, `effective_until`, `frequency`, `is_active`, `created_at`) VALUES
('cc0e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', 'KL-JB Morning Express', '08:00:00', '13:00:00', '[1,2,3,4,5,6,7]', '2024-01-01', '2024-12-31', 'daily', 1, '2025-06-12 05:16:44'),
('cc0e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'KL-JB Afternoon Service', '14:00:00', '19:00:00', '[1,2,3,4,5,6,7]', '2024-01-01', '2024-12-31', 'daily', 1, '2025-06-12 05:16:44'),
('cc0e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'KL-Penang Express', '09:30:00', '13:30:00', '[1,2,3,4,5,6,7]', '2024-01-01', '2024-12-31', 'daily', 1, '2025-06-12 05:16:44'),
('cc0e8400-e29b-41d4-a716-446655440004', 'aa0e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'KL-Malacca Shuttle', '10:00:00', '12:30:00', '[1,2,3,4,5,6]', '2024-01-01', '2024-12-31', 'daily', 1, '2025-06-12 05:16:44'),
('cc0e8400-e29b-41d4-a716-446655440005', 'aa0e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440002', 'KL-Genting Tourist Special', '07:30:00', '09:00:00', '[6,7]', '2024-01-01', '2024-12-31', 'weekend', 1, '2025-06-12 05:16:44');

-- --------------------------------------------------------

--
-- Table structure for table `seat_types`
--

CREATE TABLE `seat_types` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(50) NOT NULL,
  `price_multiplier` decimal(3,2) DEFAULT 1.00,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `seat_types`
--

INSERT INTO `seat_types` (`id`, `name`, `price_multiplier`, `features`, `description`, `is_active`) VALUES
('07d46e80-474c-11f0-a838-6ea21d1b4740', 'Economy', 1.00, '{\"reclining\": false, \"extra_legroom\": false}', 'Standard economy seats', 1),
('07d47bbe-474c-11f0-a838-6ea21d1b4740', 'Business', 1.50, '{\"reclining\": true, \"extra_legroom\": true, \"usb_charging\": true}', 'Premium business class seats', 1),
('07d4837a-474c-11f0-a838-6ea21d1b4740', 'Premium', 1.25, '{\"reclining\": true, \"priority_boarding\": true}', 'Mid-tier premium seats', 1),
('07d483b6-474c-11f0-a838-6ea21d1b4740', 'Accessible', 1.00, '{\"wheelchair_accessible\": true, \"extra_space\": true}', 'Accessible seats for disabled passengers', 1),
('seat_e29b-41d4-a716-446655440001', 'Economy', 1.00, '{\"reclining\": false, \"extra_legroom\": false, \"window_view\": \"standard\"}', 'Standard economy seats with basic comfort', 1),
('seat_e29b-41d4-a716-446655440002', 'Business', 1.50, '{\"reclining\": true, \"extra_legroom\": true, \"window_view\": \"enhanced\", \"usb_charging\": true}', 'Premium business class seats with enhanced comfort', 1),
('seat_e29b-41d4-a716-446655440003', 'Premium', 1.25, '{\"reclining\": true, \"extra_legroom\": false, \"window_view\": \"standard\", \"priority_boarding\": true}', 'Mid-tier premium seats with selected benefits', 1),
('seat_e29b-41d4-a716-446655440004', 'Accessible', 1.00, '{\"wheelchair_accessible\": true, \"extra_space\": true, \"priority_location\": true}', 'Accessible seats for passengers with disabilities', 1);

-- --------------------------------------------------------

--
-- Table structure for table `trips`
--

CREATE TABLE `trips` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `trip_number` varchar(50) NOT NULL,
  `schedule_id` char(36) DEFAULT NULL,
  `vehicle_id` char(36) DEFAULT NULL,
  `route_id` char(36) NOT NULL,
  `departure_datetime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estimated_arrival_datetime` timestamp NULL DEFAULT NULL,
  `actual_departure_datetime` timestamp NULL DEFAULT NULL,
  `actual_arrival_datetime` timestamp NULL DEFAULT NULL,
  `status` enum('scheduled','boarding','in_transit','arrived','cancelled','delayed') DEFAULT 'scheduled',
  `cancellation_reason` text DEFAULT NULL,
  `delay_minutes` int(11) DEFAULT 0,
  `available_seats` int(11) DEFAULT NULL,
  `total_seats` int(11) DEFAULT NULL,
  `base_price` decimal(10,2) DEFAULT NULL,
  `dynamic_pricing_enabled` tinyint(1) DEFAULT 1,
  `weather_conditions` varchar(20) DEFAULT 'clear',
  `traffic_conditions` varchar(20) DEFAULT 'normal',
  `driver_primary_id` char(36) DEFAULT NULL,
  `driver_secondary_id` char(36) DEFAULT NULL,
  `conductor_id` char(36) DEFAULT NULL,
  `special_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `trips`
--

INSERT INTO `trips` (`id`, `trip_number`, `schedule_id`, `vehicle_id`, `route_id`, `departure_datetime`, `estimated_arrival_datetime`, `actual_departure_datetime`, `actual_arrival_datetime`, `status`, `cancellation_reason`, `delay_minutes`, `available_seats`, `total_seats`, `base_price`, `dynamic_pricing_enabled`, `weather_conditions`, `traffic_conditions`, `driver_primary_id`, `driver_secondary_id`, `conductor_id`, `special_notes`, `created_at`, `updated_at`) VALUES
('110e8400-e29b-41d4-a716-446655440001', 'TWT240101001', 'cc0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440001', '2025-06-25 00:00:00', '2025-06-25 04:30:00', NULL, NULL, 'scheduled', NULL, 0, 5, 30, 45.00, 1, 'clear', 'normal', 'dd0e8400-e29b-41d4-a716-446655440001', NULL, 'dd0e8400-e29b-41d4-a716-446655440004', NULL, '2025-06-12 05:16:53', '2025-06-15 06:09:04'),
('110e8400-e29b-41d4-a716-446655440002', 'TWT240101002', 'cc0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '2025-06-26 07:00:00', '2025-06-26 11:30:00', NULL, NULL, 'scheduled', NULL, 0, 42, 45, 45.00, 1, 'clear', 'normal', 'dd0e8400-e29b-41d4-a716-446655440002', NULL, 'dd0e8400-e29b-41d4-a716-446655440005', NULL, '2025-06-12 05:16:53', '2025-06-15 06:09:04'),
('110e8400-e29b-41d4-a716-446655440003', 'TWT240102001', 'cc0e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440001', '2025-06-26 13:00:00', '2025-06-26 17:30:00', NULL, NULL, 'scheduled', NULL, 0, 25, 30, 45.00, 1, 'clear', 'normal', 'dd0e8400-e29b-41d4-a716-446655440001', NULL, 'dd0e8400-e29b-41d4-a716-446655440004', NULL, '2025-06-12 05:16:53', '2025-06-15 06:09:04'),
('110e8400-e29b-41d4-a716-446655440004', 'TWT240102002', 'cc0e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', '2025-06-28 02:00:00', '2025-06-28 06:30:00', NULL, NULL, 'scheduled', NULL, 0, 40, 45, 45.00, 1, 'clear', 'normal', 'dd0e8400-e29b-41d4-a716-446655440002', NULL, 'dd0e8400-e29b-41d4-a716-446655440005', NULL, '2025-06-12 05:16:53', '2025-06-15 06:09:04'),
('110e8400-e29b-41d4-a716-446655440005', 'TWT240101003', 'cc0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440005', 'aa0e8400-e29b-41d4-a716-446655440002', '2025-06-26 01:00:00', '2025-06-26 05:30:00', NULL, NULL, 'scheduled', NULL, 0, 27, 30, 55.00, 1, 'clear', 'normal', 'dd0e8400-e29b-41d4-a716-446655440003', NULL, 'dd0e8400-e29b-41d4-a716-446655440004', NULL, '2025-06-12 05:16:53', '2025-06-15 06:09:04'),
('110e8400-e29b-41d4-a716-446655440006', 'TWT240102003', 'cc0e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440005', 'aa0e8400-e29b-41d4-a716-446655440002', '2025-06-27 00:30:00', '2025-06-27 05:00:00', NULL, NULL, 'scheduled', NULL, 0, 24, 30, 55.00, 1, 'clear', 'normal', 'dd0e8400-e29b-41d4-a716-446655440003', NULL, 'dd0e8400-e29b-41d4-a716-446655440004', NULL, '2025-06-12 05:16:53', '2025-06-15 06:09:04'),
('110e8400-e29b-41d4-a716-446655440007', 'TWT240101004', 'cc0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440003', '2025-06-25 06:00:00', '2025-06-25 10:30:00', NULL, NULL, 'scheduled', NULL, 0, 0, 12, 25.00, 1, 'clear', 'normal', 'dd0e8400-e29b-41d4-a716-446655440002', NULL, NULL, NULL, '2025-06-12 05:16:53', '2025-06-15 06:09:04'),
('110e8400-e29b-41d4-a716-446655440008', 'TWT240102004', 'cc0e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440003', '2025-06-27 08:30:00', '2025-06-27 13:00:00', NULL, NULL, 'scheduled', NULL, 0, 8, 12, 25.00, 1, 'clear', 'normal', 'dd0e8400-e29b-41d4-a716-446655440002', NULL, NULL, NULL, '2025-06-12 05:16:53', '2025-06-15 06:09:04'),
('110e8400-e29b-41d4-a716-446655440009', 'TWT240128001', 'cc0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440005', '2025-06-28 10:00:00', '2025-06-28 14:30:00', NULL, NULL, 'scheduled', NULL, 0, 26, 30, 20.00, 1, 'clear', 'normal', 'dd0e8400-e29b-41d4-a716-446655440001', NULL, 'dd0e8400-e29b-41d4-a716-446655440005', NULL, '2025-06-12 05:16:53', '2025-06-15 06:09:04'),
('110e8400-e29b-41d4-a716-446655440010', 'TWT240129001', 'cc0e8400-e29b-41d4-a716-446655440005', '990e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440005', '2025-06-29 03:00:00', '2025-06-29 07:30:00', NULL, NULL, 'scheduled', NULL, 0, 22, 30, 20.00, 1, 'clear', 'normal', 'dd0e8400-e29b-41d4-a716-446655440001', NULL, 'dd0e8400-e29b-41d4-a716-446655440005', NULL, '2025-06-12 05:16:53', '2025-06-15 06:09:04'),
('trip-001', '', NULL, 'v-001', 'aa0e8400-e29b-41d4-a716-446655440001', '2025-06-25 12:00:00', '2025-06-25 16:30:00', NULL, NULL, 'scheduled', NULL, 0, 32, 45, 45.00, 1, 'clear', 'normal', NULL, NULL, NULL, NULL, '2025-06-15 05:29:52', '2025-06-15 06:09:04');

-- --------------------------------------------------------

--
-- Table structure for table `trip_seats`
--

CREATE TABLE `trip_seats` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `trip_id` char(36) NOT NULL,
  `seat_number` varchar(10) NOT NULL,
  `seat_type_id` char(36) DEFAULT NULL,
  `row_number` int(11) DEFAULT NULL,
  `seat_position` varchar(10) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `is_blocked` tinyint(1) DEFAULT 0,
  `base_price` decimal(10,2) NOT NULL,
  `current_price` decimal(10,2) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `accessibility_features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`accessibility_features`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `trip_seats`
--

INSERT INTO `trip_seats` (`id`, `trip_id`, `seat_number`, `seat_type_id`, `row_number`, `seat_position`, `is_available`, `is_blocked`, `base_price`, `current_price`, `features`, `accessibility_features`) VALUES
('120e8400-e29b-41d4-a716-446655440001', '110e8400-e29b-41d4-a716-446655440001', '1A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'A', 0, 0, 67.50, 67.50, '{\"window\": true, \"reclining\": true}', NULL),
('120e8400-e29b-41d4-a716-446655440002', '110e8400-e29b-41d4-a716-446655440001', '1B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'B', 0, 0, 67.50, 67.50, '{\"aisle\": true, \"reclining\": true}', NULL),
('120e8400-e29b-41d4-a716-446655440003', '110e8400-e29b-41d4-a716-446655440001', '2A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'A', 1, 0, 67.50, 67.50, '{\"window\": true, \"reclining\": true}', NULL),
('120e8400-e29b-41d4-a716-446655440004', '110e8400-e29b-41d4-a716-446655440001', '2B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'B', 0, 0, 67.50, 67.50, '{\"aisle\": true, \"reclining\": true}', NULL),
('120e8400-e29b-41d4-a716-446655440005', '110e8400-e29b-41d4-a716-446655440001', '3A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'A', 1, 0, 67.50, 67.50, '{\"window\": true, \"reclining\": true}', NULL),
('120e8400-e29b-41d4-a716-446655440006', '110e8400-e29b-41d4-a716-446655440001', '3B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'B', 1, 0, 67.50, 67.50, '{\"aisle\": true, \"reclining\": true}', NULL),
('120e8400-e29b-41d4-a716-446655440007', '110e8400-e29b-41d4-a716-446655440001', '6A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'A', 0, 0, 45.00, 45.00, '{\"window\": true}', NULL),
('120e8400-e29b-41d4-a716-446655440008', '110e8400-e29b-41d4-a716-446655440001', '6B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'B', 0, 0, 45.00, 45.00, '{\"aisle\": true}', NULL),
('120e8400-e29b-41d4-a716-446655440009', '110e8400-e29b-41d4-a716-446655440001', '7A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'A', 1, 0, 45.00, 45.00, '{\"window\": true}', NULL),
('120e8400-e29b-41d4-a716-446655440010', '110e8400-e29b-41d4-a716-446655440001', '7B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'B', 1, 0, 45.00, 45.00, '{\"aisle\": true}', NULL),
('17003338-4dbe-4108-adc2-7e454b3e27d2', '110e8400-e29b-41d4-a716-446655440008', '1C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'C', 1, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"middle\":false}', NULL),
('2b91d135-8adb-4ab7-8724-caad25317d3a', '110e8400-e29b-41d4-a716-446655440008', '4A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'A', 1, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"middle\":false}', NULL),
('2fdaf128-b84d-4f0c-98fd-e4b2f38ba3f9', '110e8400-e29b-41d4-a716-446655440008', '3B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'B', 1, 0, 25.00, 25.00, '{\"window\":false,\"aisle\":true,\"middle\":true}', NULL),
('4bded5b7-8daa-472f-aa1f-d6e3a9914d93', '110e8400-e29b-41d4-a716-446655440008', '1B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'B', 1, 0, 25.00, 25.00, '{\"window\":false,\"aisle\":true,\"middle\":true}', NULL),
('6951a194-cfc8-4a4a-a787-16f833ee4ff6', '110e8400-e29b-41d4-a716-446655440008', '2B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'B', 1, 0, 25.00, 25.00, '{\"window\":false,\"aisle\":true,\"middle\":true}', NULL),
('8a913032-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '1A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'A', 1, 0, 67.50, 67.50, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a91db54-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '1B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'B', 1, 0, 67.50, 67.50, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a91f42c-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '1C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'C', 1, 0, 67.50, 67.50, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a920458-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '2A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'A', 0, 0, 67.50, 67.50, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a92109c-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '2B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'B', 1, 0, 67.50, 67.50, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a921ef2-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '2C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'C', 1, 0, 67.50, 67.50, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a9229d8-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '3A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'A', 1, 0, 67.50, 67.50, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a9234b4-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '3B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'B', 1, 0, 67.50, 67.50, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a923ee6-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '3C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'C', 1, 0, 67.50, 67.50, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a924a1c-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '4A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a9254da-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '4B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'B', 0, 0, 45.00, 45.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a925e94-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '4C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'C', 1, 0, 45.00, 45.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a92675e-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '5A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'A', 0, 0, 45.00, 45.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a927154-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '5B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'B', 1, 0, 45.00, 45.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a927a32-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '5C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'C', 1, 0, 45.00, 45.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a92834c-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '6A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a929116-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '6B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'B', 1, 0, 45.00, 45.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a929a94-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '6C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'C', 1, 0, 45.00, 45.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a92a2dc-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '7A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a92abec-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '7B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'B', 0, 0, 45.00, 45.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a92b682-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '7C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'C', 1, 0, 45.00, 45.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a92c0a0-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '8A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a92c9ba-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '8B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'B', 1, 0, 45.00, 45.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a92d1f8-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '8C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'C', 1, 0, 45.00, 45.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a92dc3e-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '9A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a92e4f4-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '9B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'B', 1, 0, 45.00, 45.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a92ecc4-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '9C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'C', 0, 0, 45.00, 45.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a92f49e-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '10A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a92fe62-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '10B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'B', 1, 0, 45.00, 45.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a9308ee-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440003', '10C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'C', 1, 0, 45.00, 45.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a934566-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '1A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'A', 1, 0, 82.50, 82.50, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a935254-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '1B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'B', 1, 0, 82.50, 82.50, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a935a9c-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '1C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'C', 1, 0, 82.50, 82.50, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a936320-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '2A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'A', 1, 0, 82.50, 82.50, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a936d3e-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '2B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'B', 1, 0, 82.50, 82.50, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a9376c6-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '2C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'C', 1, 0, 82.50, 82.50, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a937f86-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '3A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'A', 1, 0, 82.50, 82.50, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a9387b0-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '3B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'B', 1, 0, 82.50, 82.50, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a93907a-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '3C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'C', 1, 0, 82.50, 82.50, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a939804-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '4A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'A', 1, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a93a010-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '4B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'B', 0, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a93a902-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '4C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'C', 1, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a93b0f0-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '5A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'A', 1, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a93b87a-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '5B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'B', 1, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a93bf96-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '5C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'C', 1, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a93cc16-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '6A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'A', 1, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a93d3f0-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '6B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'B', 1, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a93dc9c-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '6C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'C', 0, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a93e53e-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '7A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'A', 1, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a93ee58-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '7B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'B', 1, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a93f86c-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '7C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'C', 1, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a940208-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '8A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'A', 1, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a940af0-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '8B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'B', 1, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a941536-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '8C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'C', 1, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a941d1a-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '9A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'A', 0, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a942ab2-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '9B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'B', 1, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a943318-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '9C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'C', 1, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a943b56-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '10A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'A', 1, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a944376-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '10B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'B', 1, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a944d30-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440005', '10C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'C', 1, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a948516-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '1A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'A', 0, 0, 82.50, 82.50, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a949fba-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '1B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'B', 1, 0, 82.50, 82.50, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a94a91a-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '1C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'C', 1, 0, 82.50, 82.50, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a94b126-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '2A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'A', 1, 0, 82.50, 82.50, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a94b932-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '2B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'B', 1, 0, 82.50, 82.50, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a94c1de-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '2C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'C', 1, 0, 82.50, 82.50, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a94caa8-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '3A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'A', 1, 0, 82.50, 82.50, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a94d26e-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '3B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'B', 0, 0, 82.50, 82.50, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a94dade-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '3C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'C', 1, 0, 82.50, 82.50, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a94e2c2-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '4A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'A', 0, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a94ed9e-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '4B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'B', 1, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a9500fe-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '4C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'C', 1, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a950fae-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '5A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'A', 1, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a9518be-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '5B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'B', 1, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a952368-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '5C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'C', 0, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a952b56-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '6A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'A', 1, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a9533bc-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '6B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'B', 0, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a953d1c-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '6C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'C', 1, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a9544c4-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '7A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'A', 1, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a954d52-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '7B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'B', 1, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a955982-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '7C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'C', 1, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a9564d6-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '8A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'A', 1, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a956f76-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '8B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'B', 1, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a95778c-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '8C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'C', 0, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a957f84-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '9A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'A', 1, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a95877c-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '9B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'B', 1, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a958fe2-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '9C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'C', 1, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a959816-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '10A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'A', 1, 0, 55.00, 55.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a95a13a-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '10B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'B', 1, 0, 55.00, 55.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a95a96e-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440006', '10C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'C', 1, 0, 55.00, 55.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a95e794-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '1A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'A', 1, 0, 30.00, 30.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a95f3e2-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '1B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'B', 1, 0, 30.00, 30.00, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a95fbc6-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '1C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'C', 1, 0, 30.00, 30.00, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a9604fe-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '2A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'A', 1, 0, 30.00, 30.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a960d0a-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '2B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'B', 1, 0, 30.00, 30.00, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a961598-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '2C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'C', 1, 0, 30.00, 30.00, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a961dcc-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '3A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'A', 0, 0, 30.00, 30.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a9625a6-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '3B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'B', 1, 0, 30.00, 30.00, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a962dd0-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '3C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'C', 1, 0, 30.00, 30.00, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a963690-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '4A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'A', 1, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a963e56-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '4B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'B', 1, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a964b8a-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '4C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'C', 1, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a96549a-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '5A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'A', 1, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a965c56-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '5B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'B', 0, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a966552-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '5C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'C', 1, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a966d18-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '6A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'A', 1, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a967538-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '6B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'B', 1, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a967d08-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '6C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'C', 1, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a9685c8-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '7A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'A', 1, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a968e4c-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '7B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'B', 1, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a9696bc-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '7C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'C', 0, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a96a0ee-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '8A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'A', 1, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a96abfc-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '8B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'B', 1, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a96b610-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '8C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'C', 1, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a96c042-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '9A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'A', 1, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a96c9c0-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '9B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'B', 1, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a96d398-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '9C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'C', 1, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a96dcda-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '10A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'A', 0, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a96e63a-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '10B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'B', 1, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a96f01c-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440009', '10C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'C', 1, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a972ba4-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '1A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'A', 1, 0, 30.00, 30.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a9735fe-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '1B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'B', 1, 0, 30.00, 30.00, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a9745b2-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '1C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 1, 'C', 1, 0, 30.00, 30.00, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a974d32-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '2A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'A', 0, 0, 30.00, 30.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a97548a-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '2B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'B', 1, 0, 30.00, 30.00, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a975bc4-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '2C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 2, 'C', 0, 0, 30.00, 30.00, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a976858-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '3A', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'A', 1, 0, 30.00, 30.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":true}', NULL),
('8a9770c8-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '3B', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'B', 1, 0, 30.00, 30.00, '{\"window\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a977898-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '3C', '07d47bbe-474c-11f0-a838-6ea21d1b4740', 3, 'C', 1, 0, 30.00, 30.00, '{\"aisle\":true,\"pair\":true,\"reclining\":true}', NULL),
('8a978180-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '4A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'A', 1, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a978a22-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '4B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'B', 1, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a9792a6-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '4C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'C', 1, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a979986-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '5A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'A', 0, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a97a03e-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '5B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'B', 1, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a97a7aa-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '5C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'C', 0, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a97af02-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '6A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'A', 1, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a97b6c8-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '6B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'B', 1, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a97bda8-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '6C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'C', 1, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a97c49c-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '7A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'A', 1, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a97cb86-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '7B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'B', 0, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a97d234-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '7C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'C', 1, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a97d8ec-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '8A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'A', 0, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a97dfa4-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '8B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'B', 1, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a97e6ac-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '8C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'C', 1, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a97f232-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '9A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'A', 1, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a97f958-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '9B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'B', 1, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a980646-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '9C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'C', 0, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a980e16-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '10A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'A', 1, 0, 20.00, 20.00, '{\"window\":true,\"single\":true,\"privacy\":true,\"reclining\":false}', NULL),
('8a9816b8-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '10B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'B', 0, 0, 20.00, 20.00, '{\"window\":true,\"pair\":true,\"reclining\":false}', NULL),
('8a981e38-492d-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440010', '10C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'C', 1, 0, 20.00, 20.00, '{\"aisle\":true,\"pair\":true,\"reclining\":false}', NULL),
('8cf3fa70-cb9c-4014-bf7f-a72df9fe55da', '110e8400-e29b-41d4-a716-446655440008', '2C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'C', 1, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"middle\":false}', NULL),
('961e9775-118b-4eac-9a64-c62f50edde41', '110e8400-e29b-41d4-a716-446655440008', '2A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'A', 1, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"middle\":false}', NULL),
('9af518db-731a-4852-aa1c-52e178de3365', '110e8400-e29b-41d4-a716-446655440008', '1A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'A', 1, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"middle\":false}', NULL),
('b162313e-d0c4-47f7-98a2-f2e1eb5c1847', '110e8400-e29b-41d4-a716-446655440008', '4B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'B', 1, 0, 25.00, 25.00, '{\"window\":false,\"aisle\":true,\"middle\":true}', NULL),
('b6a39be2-d99c-4c25-9546-df3240d9c375', '110e8400-e29b-41d4-a716-446655440008', '3A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'A', 1, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"middle\":false}', NULL),
('cb752ae5-264e-4ee5-b9bc-14b5fa09e550', '110e8400-e29b-41d4-a716-446655440008', '3C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'C', 1, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"middle\":false}', NULL),
('db9c26d4-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '1A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9d5536-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '1B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9d7886-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '1C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9d8ace-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '1D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9d9ca8-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '2A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9dd3b2-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '2B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9de3ac-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '2C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9e00b2-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '2D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9e1098-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '3A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9e2114-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '3B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9e8f78-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '3C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9e9b12-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '3D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9ea922-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '4A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9eb584-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '4B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'B', 0, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9ec1aa-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '4C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9ed2a8-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '4D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9eecb6-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '5A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9f11f0-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '5B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9f251e-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '5C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9f31b2-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '5D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9f3e14-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '6A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'A', 0, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9f534a-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '6B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9f6632-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '6C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9f78d4-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '6D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9f99b8-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '7A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9fc64a-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '7B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9fded2-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '7C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('db9ff2c8-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '7D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'D', 0, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('db9ffda4-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '8A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba015aa-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '8B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba01eec-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '8C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba02748-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '8D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba034f4-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '9A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba03e5e-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '9B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba04958-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '9C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba05470-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '9D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba05d44-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '10A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba066ae-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '10B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba0763a-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '10C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba088dc-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '10D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba09598-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '11A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 11, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba09ef8-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '11B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 11, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba0ae20-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '11C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 11, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba0bb86-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '11D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 11, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba0dda0-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440002', '12A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 12, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba37c72-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '1A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba3869a-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '1B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba39900-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '1C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba3ad6e-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '1D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba3b5a2-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '2A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba3be76-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '2B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba3c7ea-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '2C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba420d2-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '2D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba464a2-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '3A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba46d26-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '3B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba47e10-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '3C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL);
INSERT INTO `trip_seats` (`id`, `trip_id`, `seat_number`, `seat_type_id`, `row_number`, `seat_position`, `is_available`, `is_blocked`, `base_price`, `current_price`, `features`, `accessibility_features`) VALUES
('dba48e3c-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '3D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'D', 0, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba49670-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '4A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba4a41c-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '4B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba4bb3c-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '4C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba4ca50-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '4D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba4d6a8-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '5A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba4e1e8-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '5B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba4f07a-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '5C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'C', 0, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba4fb6a-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '5D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 5, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba50786-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '6A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba512ee-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '6B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba51eb0-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '6C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba52f2c-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '6D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 6, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba537ec-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '7A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba540ac-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '7B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'B', 0, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba54d54-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '7C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba555d8-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '7D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 7, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba55e66-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '8A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba56c94-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '8B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba588d2-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '8C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba5914c-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '8D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 8, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba59b1a-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '9A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'A', 0, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba5a524-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '9B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba5adf8-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '9C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba5b64a-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '9D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 9, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba5be9c-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '10A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba5c70c-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '10B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba5cf5e-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '10C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba5d7b0-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '10D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 10, 'D', 0, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba5ded6-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '11A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 11, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba5e9e4-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '11B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 11, 'B', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba5f3a8-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '11C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 11, 'C', 1, 0, 45.00, 45.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba5ffba-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '11D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 11, 'D', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba6079e-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440004', '12A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 12, 'A', 1, 0, 45.00, 45.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba82826-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440007', '1A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'A', 0, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba84f68-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440007', '1B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'B', 0, 0, 25.00, 25.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba857ec-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440007', '1C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'C', 0, 0, 25.00, 25.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba860ca-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440007', '1D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 1, 'D', 0, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba86836-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440007', '2A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'A', 0, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba86fa2-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440007', '2B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'B', 0, 0, 25.00, 25.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba88fdc-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440007', '2C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'C', 0, 0, 25.00, 25.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dba9e602-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440007', '2D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 2, 'D', 0, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba9f1c4-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440007', '3A', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'A', 0, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('dba9fb24-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440007', '3B', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'B', 0, 0, 25.00, 25.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dbaa3026-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440007', '3C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'C', 0, 0, 25.00, 25.00, '{\"window\":false,\"aisle\":true,\"reclining\":false}', NULL),
('dbaa381e-491a-11f0-8e5e-6ea21d1b473f', '110e8400-e29b-41d4-a716-446655440007', '3D', '07d46e80-474c-11f0-a838-6ea21d1b4740', 3, 'D', 0, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"reclining\":false}', NULL),
('fe912e2e-4ddc-4cab-b0d6-5648b8d8d19f', '110e8400-e29b-41d4-a716-446655440008', '4C', '07d46e80-474c-11f0-a838-6ea21d1b4740', 4, 'C', 1, 0, 25.00, 25.00, '{\"window\":true,\"aisle\":false,\"middle\":false}', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `email` varchar(320) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('admin','user','operator','customer_service') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT 1,
  `email_verified` tinyint(1) DEFAULT 0,
  `phone_verified` tinyint(1) DEFAULT 0,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other','prefer_not_to_say') DEFAULT NULL,
  `profile_image_url` text DEFAULT NULL,
  `preferred_language` varchar(10) DEFAULT 'en',
  `timezone` varchar(50) DEFAULT 'Asia/Kuala_Lumpur',
  `marketing_consent` tinyint(1) DEFAULT 0,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `failed_login_attempts` int(11) DEFAULT 0,
  `account_locked_until` timestamp NULL DEFAULT NULL,
  `temp_password_hash` varchar(255) DEFAULT NULL,
  `temp_password_expires_at` timestamp NULL DEFAULT NULL,
  `email_verification_token` varchar(255) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `email_notifications` tinyint(1) DEFAULT 1,
  `sms_notifications` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `role`, `is_active`, `email_verified`, `phone_verified`, `date_of_birth`, `gender`, `profile_image_url`, `preferred_language`, `timezone`, `marketing_consent`, `last_login_at`, `failed_login_attempts`, `account_locked_until`, `temp_password_hash`, `temp_password_expires_at`, `email_verification_token`, `password_reset_token`, `password_reset_expires_at`, `created_at`, `updated_at`, `email_notifications`, `sms_notifications`) VALUES
('1a9c47b3-b702-43c7-9506-ef770a6afd9c', 'gsd.personal031105v@gmail.com', '$2a$12$I0tAHyC/B87WSXzIc6ZQT.ZvCvWm20yzTf0nCIqhF54ZCq5zpR6YK', 'Kayden', 'Goh', '', 'user', 1, 1, 0, NULL, NULL, NULL, 'en', 'Asia/Kuala_Lumpur', 0, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-23 09:02:59', '2025-06-23 09:34:35', 1, 0),
('550e8400-e29b-41d4-a716-446655440000', 'admin@twttransport.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMpYWxEm.rn8m9q', 'System', 'Administrator', '+60123456789', 'admin', 1, 1, 0, NULL, NULL, NULL, 'en', 'Asia/Kuala_Lumpur', 0, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2023-12-31 16:00:00', '2025-06-12 05:16:44', 1, 0),
('550e8400-e29b-41d4-a716-446655440001', 'manager@twttransport.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMpYWxEm.rn8m9q', 'Transport', 'Manager', '+60123456788', 'operator', 1, 1, 0, NULL, NULL, NULL, 'en', 'Asia/Kuala_Lumpur', 0, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2023-12-31 16:00:00', '2025-06-12 05:16:44', 1, 0),
('550e8400-e29b-41d4-a716-446655440010', 'john.doe@email.com', '$2a$12$p9bhHhzPxzpDu4aH89M4zOLgtJzDlawR5I.fcOVriDLVb3a.yaoPS', 'John', 'Doe', '+60187654321', 'user', 1, 1, 0, '1990-05-15', 'male', NULL, 'en', 'Asia/Kuala_Lumpur', 0, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-15 02:30:00', '2025-06-23 14:48:39', 1, 0),
('550e8400-e29b-41d4-a716-446655440011', 'jane.smith@email.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMpYWxEm.rn8m9q', 'Jane', 'Smith', '+60198765432', 'user', 1, 1, 0, '1985-12-22', 'female', NULL, 'en', 'Asia/Kuala_Lumpur', 0, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-16 06:45:00', '2025-06-12 05:16:44', 1, 0),
('550e8400-e29b-41d4-a716-446655440012', 'ahmad.hassan@email.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMpYWxEm.rn8m9q', 'Ahmad', 'Hassan', '+60176543210', 'user', 1, 1, 0, '1992-03-08', 'male', NULL, 'en', 'Asia/Kuala_Lumpur', 0, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-17 01:15:00', '2025-06-12 05:16:44', 1, 0),
('550e8400-e29b-41d4-a716-446655440013', 'siti.nurhaliza@email.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMpYWxEm.rn8m9q', 'Siti', 'Nurhaliza', '+60134567890', 'user', 1, 1, 0, '1988-07-30', 'female', NULL, 'ms', 'Asia/Kuala_Lumpur', 0, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-18 08:20:00', '2025-06-12 05:16:44', 1, 0),
('550e8400-e29b-41d4-a716-446655440014', 'raj.kumar@email.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMpYWxEm.rn8m9q', 'Raj', 'Kumar', '+60145678901', 'user', 1, 1, 0, '1995-11-12', 'male', NULL, 'ta', 'Asia/Kuala_Lumpur', 0, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-19 03:30:00', '2025-06-12 05:16:44', 1, 0),
('550e8400-e29b-41d4-a716-446655440015', 'lim.mei.ling@email.com', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeVMpYWxEm.rn8m9q', 'Lim', 'Mei Ling', '+60156789012', 'user', 1, 1, 0, '1991-09-05', 'female', NULL, 'zh', 'Asia/Kuala_Lumpur', 0, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2024-01-20 05:45:00', '2025-06-12 05:16:44', 1, 0),
('a26b3d63-92dd-4c97-917d-cd8cdaf9993d', 'admin@transportbooking.com', '$2a$12$p9bhHhzPxzpDu4aH89M4zOLgtJzDlawR5I.fcOVriDLVb3a.yaoPS', 'Admin', 'User', NULL, 'admin', 1, 1, 0, NULL, NULL, NULL, 'en', 'Asia/Kuala_Lumpur', 0, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-14 12:04:38', '2025-06-24 01:35:09', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `vehicle_number` varchar(50) NOT NULL,
  `license_plate` varchar(20) NOT NULL,
  `vehicle_type_id` char(36) NOT NULL,
  `model` varchar(100) DEFAULT NULL,
  `manufacturer` varchar(100) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `vin` varchar(17) DEFAULT NULL,
  `status` enum('active','maintenance','retired','inspection') DEFAULT 'active',
  `current_mileage` int(11) DEFAULT 0,
  `fuel_type` varchar(20) DEFAULT 'diesel',
  `insurance_policy_number` varchar(50) DEFAULT NULL,
  `insurance_expiry` date DEFAULT NULL,
  `road_tax_expiry` date DEFAULT NULL,
  `last_service_date` date DEFAULT NULL,
  `next_service_due` date DEFAULT NULL,
  `gps_device_id` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `vehicle_number`, `license_plate`, `vehicle_type_id`, `model`, `manufacturer`, `year`, `vin`, `status`, `current_mileage`, `fuel_type`, `insurance_policy_number`, `insurance_expiry`, `road_tax_expiry`, `last_service_date`, `next_service_due`, `gps_device_id`, `created_at`, `updated_at`) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'TWT-001', 'WKL 9001', '880e8400-e29b-41d4-a716-446655440001', 'OH1830L', 'Mercedes-Benz', 2022, '1HGBH41JXMN109186', 'active', 125000, 'diesel', NULL, '2025-06-30', '2025-12-31', '2024-11-15', '2025-02-15', NULL, '2025-06-12 05:16:44', '2025-06-12 05:16:44'),
('990e8400-e29b-41d4-a716-446655440002', 'TWT-002', 'WKL 9002', '880e8400-e29b-41d4-a716-446655440002', 'K410IB', 'Scania', 2023, '2HGBH41JXMN109187', 'active', 85000, 'diesel', NULL, '2025-08-31', '2025-12-31', '2024-11-20', '2025-02-20', NULL, '2025-06-12 05:16:44', '2025-06-12 05:16:44'),
('990e8400-e29b-41d4-a716-446655440003', 'TWT-003', 'WKL 9003', '880e8400-e29b-41d4-a716-446655440003', 'Hiace', 'Toyota', 2021, '3HGBH41JXMN109188', 'active', 95000, 'diesel', NULL, '2025-05-31', '2025-12-31', '2024-11-10', '2025-02-10', NULL, '2025-06-12 05:16:44', '2025-06-12 05:16:44'),
('990e8400-e29b-41d4-a716-446655440004', 'TWT-004', 'WKL 9004', '880e8400-e29b-41d4-a716-446655440001', 'B8R', 'Volvo', 2022, '4HGBH41JXMN109189', 'active', 110000, 'diesel', NULL, '2025-07-31', '2025-12-31', '2024-11-25', '2025-02-25', NULL, '2025-06-12 05:16:44', '2025-06-12 05:16:44'),
('990e8400-e29b-41d4-a716-446655440005', 'TWT-005', 'WKL 9005', '880e8400-e29b-41d4-a716-446655440002', 'K380IB', 'Scania', 2023, '5HGBH41JXMN109190', 'active', 75000, 'diesel', NULL, '2025-09-30', '2025-12-31', '2024-12-01', '2025-03-01', NULL, '2025-06-12 05:16:44', '2025-06-12 05:16:44'),
('990e8400-e29b-41d4-a716-446655440006', 'TWT-006', 'WKL 9006', '880e8400-e29b-41d4-a716-446655440004', '6128', 'MAN', 2022, '6HGBH41JXMN109191', 'active', 140000, 'diesel', NULL, '2025-04-30', '2025-12-31', '2024-12-10', '2025-01-10', NULL, '2025-06-12 05:16:44', '2025-06-15 06:02:27'),
('v-001', 'TBS-001', 'WMH 1234', '880e8400-e29b-41d4-a716-446655440001', 'Mercedes OH1830', 'Mercedes-Benz', 2022, NULL, 'active', 125000, 'diesel', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-15 05:28:34', '2025-06-23 09:41:21'),
('v-002', 'TBS-002', 'WMH 1235', '880e8400-e29b-41d4-a716-446655440002', 'Scania K410IB', 'Scania', 2023, NULL, 'active', 86000, 'diesel', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-15 05:28:34', '2025-06-24 01:40:54'),
('v-003', 'TBS-003', 'WMH 1236', '880e8400-e29b-41d4-a716-446655440001', 'Volvo B8R', 'Volvo', 2022, NULL, 'active', 110000, 'diesel', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-15 05:28:34', '2025-06-15 05:28:34'),
('v-004', 'TBS-004', 'WMH 1237', '880e8400-e29b-41d4-a716-446655440002', 'Mercedes Tourismo', 'Mercedes-Benz', 2023, NULL, 'active', 95000, 'diesel', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-15 05:28:34', '2025-06-15 05:28:34'),
('v-005', 'TBS-005', 'WMH 1238', '880e8400-e29b-41d4-a716-446655440001', 'Yutong ZK6122H', 'Yutong', 2021, NULL, 'active', 145000, 'diesel', NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-15 05:28:34', '2025-06-15 05:28:34');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_types`
--

CREATE TABLE `vehicle_types` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(100) NOT NULL,
  `capacity` int(11) NOT NULL,
  `seat_configuration` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`seat_configuration`)),
  `amenities` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`amenities`)),
  `accessibility_features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`accessibility_features`)),
  `co2_emission_factor` decimal(5,3) DEFAULT NULL,
  `fuel_efficiency` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicle_types`
--

INSERT INTO `vehicle_types` (`id`, `name`, `capacity`, `seat_configuration`, `amenities`, `accessibility_features`, `co2_emission_factor`, `fuel_efficiency`, `created_at`) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Standard Bus', 45, '{\"rows\": 12, \"seats_per_row\": 4, \"aisle_position\": 2, \"layout\": \"2+2\"}', '{\"wifi\": true, \"ac\": true, \"usb_charging\": false, \"reading_lights\": true}', '{\"wheelchair_accessible\": false, \"priority_seats\": 4}', 0.680, 4.50, '2025-06-12 05:16:44'),
('880e8400-e29b-41d4-a716-446655440002', 'Luxury Coach', 30, '{\"rows\": 10, \"seats_per_row\": 3, \"aisle_position\": 1, \"layout\": \"2+1\"}', '{\"wifi\": true, \"ac\": true, \"usb_charging\": true, \"reclining_seats\": true, \"footrest\": true, \"entertainment\": true}', '{\"wheelchair_accessible\": true, \"priority_seats\": 2}', 0.850, 3.80, '2025-06-12 05:16:44'),
('880e8400-e29b-41d4-a716-446655440003', 'Mini Van', 12, '{\"rows\": 4, \"seats_per_row\": 3, \"aisle_position\": 1, \"layout\": \"2+1\"}', '{\"ac\": true, \"individual_seats\": true, \"storage\": true}', '{\"wheelchair_accessible\": false, \"priority_seats\": 2}', 0.450, 8.20, '2025-06-12 05:16:44'),
('880e8400-e29b-41d4-a716-446655440004', 'Double Decker', 55, '{\"rows\": 14, \"seats_per_row\": 4, \"aisle_position\": 2, \"layout\": \"2+2\", \"levels\": 2}', '{\"wifi\": true, \"ac\": true, \"usb_charging\": true, \"panoramic_view\": true}', '{\"wheelchair_accessible\": false, \"priority_seats\": 6}', 0.920, 3.20, '2025-06-12 05:16:44'),
('vt1', 'Standard Bus', 40, NULL, NULL, NULL, NULL, NULL, '2025-06-15 07:43:34'),
('vt2', 'Premium Bus', 30, NULL, NULL, NULL, NULL, NULL, '2025-06-15 07:43:34'),
('vt3', 'Luxury Coach', 25, NULL, NULL, NULL, NULL, NULL, '2025-06-15 07:43:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `booking_reference` (`booking_reference`),
  ADD KEY `cancelled_by` (`cancelled_by`),
  ADD KEY `idx_bookings_user` (`user_id`),
  ADD KEY `idx_bookings_trip` (`trip_id`),
  ADD KEY `idx_bookings_reference` (`booking_reference`),
  ADD KEY `idx_bookings_status` (`booking_status`),
  ADD KEY `idx_bookings_travel_date` (`travel_date`),
  ADD KEY `idx_bookings_user_trip` (`user_id`,`trip_id`),
  ADD KEY `idx_bookings_status_date` (`booking_status`,`travel_date`);

--
-- Indexes for table `email_verifications`
--
ALTER TABLE `email_verifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email_verifications_otp` (`otp_code`),
  ADD KEY `idx_email_verifications_email_purpose` (`email`,`purpose`),
  ADD KEY `idx_email_verifications_user_purpose` (`user_id`,`purpose`),
  ADD KEY `idx_email_verifications_expires` (`expires_at`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `idx_locations_code` (`code`),
  ADD KEY `idx_locations_city` (`city`),
  ADD KEY `idx_locations_active` (`is_active`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_payments_booking` (`booking_id`),
  ADD KEY `idx_payments_status` (`status`),
  ADD KEY `idx_payments_gateway` (`payment_gateway`),
  ADD KEY `idx_payments_booking_status` (`booking_id`,`status`);

--
-- Indexes for table `routes`
--
ALTER TABLE `routes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `route_code` (`route_code`),
  ADD KEY `idx_routes_code` (`route_code`),
  ADD KEY `idx_routes_origin` (`origin_id`),
  ADD KEY `idx_routes_destination` (`destination_id`),
  ADD KEY `idx_routes_active` (`is_active`);

--
-- Indexes for table `route_stops`
--
ALTER TABLE `route_stops`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_route_stop_order` (`route_id`,`stop_order`),
  ADD KEY `idx_route_stops_route` (`route_id`),
  ADD KEY `idx_route_stops_location` (`location_id`);

--
-- Indexes for table `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_type_id` (`vehicle_type_id`),
  ADD KEY `idx_schedules_route` (`route_id`),
  ADD KEY `idx_schedules_departure` (`departure_time`),
  ADD KEY `idx_schedules_active` (`is_active`);

--
-- Indexes for table `seat_types`
--
ALTER TABLE `seat_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_seat_types_name` (`name`);

--
-- Indexes for table `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `trip_number` (`trip_number`),
  ADD KEY `schedule_id` (`schedule_id`),
  ADD KEY `vehicle_id` (`vehicle_id`),
  ADD KEY `idx_trips_route_departure` (`route_id`,`departure_datetime`),
  ADD KEY `idx_trips_status` (`status`),
  ADD KEY `idx_trips_number` (`trip_number`),
  ADD KEY `idx_trips_scheduled` (`departure_datetime`,`status`);

--
-- Indexes for table `trip_seats`
--
ALTER TABLE `trip_seats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_trip_seat` (`trip_id`,`seat_number`),
  ADD KEY `seat_type_id` (`seat_type_id`),
  ADD KEY `idx_trip_seats_trip` (`trip_id`),
  ADD KEY `idx_trip_seats_available` (`trip_id`,`is_available`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_active` (`is_active`),
  ADD KEY `idx_users_temp_password` (`temp_password_expires_at`),
  ADD KEY `idx_users_email_verification_token` (`email_verification_token`),
  ADD KEY `idx_users_password_reset_token` (`password_reset_token`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vehicle_number` (`vehicle_number`),
  ADD UNIQUE KEY `license_plate` (`license_plate`),
  ADD UNIQUE KEY `vin` (`vin`),
  ADD KEY `idx_vehicles_number` (`vehicle_number`),
  ADD KEY `idx_vehicles_plate` (`license_plate`),
  ADD KEY `idx_vehicles_type` (`vehicle_type_id`),
  ADD KEY `idx_vehicles_status` (`status`);

--
-- Indexes for table `vehicle_types`
--
ALTER TABLE `vehicle_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_vehicle_types_name` (`name`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`),
  ADD CONSTRAINT `bookings_ibfk_3` FOREIGN KEY (`cancelled_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `email_verifications`
--
ALTER TABLE `email_verifications`
  ADD CONSTRAINT `email_verifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);

--
-- Constraints for table `routes`
--
ALTER TABLE `routes`
  ADD CONSTRAINT `routes_ibfk_1` FOREIGN KEY (`origin_id`) REFERENCES `locations` (`id`),
  ADD CONSTRAINT `routes_ibfk_2` FOREIGN KEY (`destination_id`) REFERENCES `locations` (`id`);

--
-- Constraints for table `route_stops`
--
ALTER TABLE `route_stops`
  ADD CONSTRAINT `route_stops_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `route_stops_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`);

--
-- Constraints for table `schedules`
--
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`),
  ADD CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`);

--
-- Constraints for table `trips`
--
ALTER TABLE `trips`
  ADD CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`),
  ADD CONSTRAINT `trips_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`),
  ADD CONSTRAINT `trips_ibfk_3` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`);

--
-- Constraints for table `trip_seats`
--
ALTER TABLE `trip_seats`
  ADD CONSTRAINT `trip_seats_ibfk_1` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `trip_seats_ibfk_2` FOREIGN KEY (`seat_type_id`) REFERENCES `seat_types` (`id`);

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_types` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
