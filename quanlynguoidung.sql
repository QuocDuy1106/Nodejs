-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 18, 2024 at 04:46 PM
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
-- Database: `quanlynguoidung`
--

-- --------------------------------------------------------

--
-- Table structure for table `nhom`
--

CREATE TABLE `nhom` (
  `idnhom` int(11) NOT NULL,
  `ten` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nhom`
--

INSERT INTO `nhom` (`idnhom`, `ten`) VALUES
(1, 'Manga'),
(2, 'Manhua'),
(3, 'Mahwa');

-- --------------------------------------------------------

--
-- Table structure for table `sanpham`
--

CREATE TABLE `sanpham` (
  `masp` int(11) NOT NULL,
  `ten` varchar(50) NOT NULL,
  `gia` int(11) NOT NULL,
  `hinhanh` varchar(500) NOT NULL,
  `mota` varchar(500) NOT NULL,
  `idnhom` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sanpham`
--

INSERT INTO `sanpham` (`masp`, `ten`, `gia`, `hinhanh`, `mota`, `idnhom`) VALUES
(13, 'Dandadan', 200, '35w2ygo2hj3xmjdy3c-170874797391305.png', 'Mathaihondai', 1),
(17, '3 báo ', 1000, 'z4842488950480_07b9ab32210add2ed9d885d0edebd6b2.jpg', 'Báo ', 1),
(18, 'Keqing', 1000000, 'chibi_keqing.png', 'kq', 1),
(19, 'Narmaya', 1000000, '1265374.jpg', 'dadada', 1),
(20, 'Hành trình của Elaina - Vol 14', 89000, 'vn-11134207-7r98o-lsl4cjxyzixl92.jpg', 'Kể về cuộc phiêu lưu trong thể giới giả tưởng của Elainaaaaaaaaaaaaa', 1),
(21, 'Goblin Slayer', 95000, '91HLjQI2cmL.jpg', 'Hành trình tiêu diệt goblin để trả thù', 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userid` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(500) NOT NULL,
  `fullname` varchar(50) NOT NULL,
  `address` varchar(150) NOT NULL,
  `sex` varchar(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `role` varchar(10) NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userid`, `username`, `password`, `fullname`, `address`, `sex`, `email`, `role`) VALUES
(32, 'user123', '$2b$10$ll5PxB9Bo7eJ1iRl9WWd4OndOcZzXTITTodo2/o.9tb9g34VdRTzG', 'Camel', '149 nguyen de', 'Nam', 'ngdanhuy147@gmail.com', 'user'),
(34, 'admin123', '$2b$10$8r91l6fnz2IsAKriZfifreR1kC2lvGiR5M8xz0nYmZu27XBOl0CFW', 'yuHnaD', 'ayya', 'Female', 'ngdanhuy147@gmail.com', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `nhom`
--
ALTER TABLE `nhom`
  ADD KEY `idnhom` (`idnhom`) USING BTREE;

--
-- Indexes for table `sanpham`
--
ALTER TABLE `sanpham`
  ADD PRIMARY KEY (`masp`),
  ADD KEY `idnhom` (`idnhom`) USING BTREE;

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userid`),
  ADD KEY `username` (`username`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `nhom`
--
ALTER TABLE `nhom`
  MODIFY `idnhom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sanpham`
--
ALTER TABLE `sanpham`
  MODIFY `masp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`idnhom`) REFERENCES `nhom` (`idnhom`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
